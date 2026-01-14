#!/usr/bin/env python3
"""
Google Drive to S3 Transfer Script
===================================
Transfers images from Google Drive folders to AWS S3 bucket.

Requirements:
    pip install google-auth google-auth-oauthlib google-api-python-client boto3 python-dotenv

Usage:
    python gdrive_to_s3.py

Environment Variables (set in .env file):
    - GOOGLE_SERVICE_ACCOUNT_EMAIL: Google Service Account email
    - GOOGLE_PRIVATE_KEY: Google Service Account private key
    - GOOGLE_DRIVE_FOLDER_IDS: Comma-separated folder IDs to sync
    - AWS_ACCESS_KEY_ID: AWS access key
    - AWS_SECRET_ACCESS_KEY: AWS secret key
    - AWS_REGION: AWS region (e.g., ap-south-1)
    - S3_BUCKET_NAME: Target S3 bucket name
"""

import os
import io
import sys
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

# Third-party imports
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseDownload
    import boto3
    from botocore.exceptions import ClientError
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Missing required package: {e}")
    print("\nPlease install required packages:")
    print("pip install google-auth google-auth-oauthlib google-api-python-client boto3 python-dotenv")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('gdrive_to_s3.log')
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


class GoogleDriveClient:
    """Google Drive API client for reading files."""
    
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    IMAGE_MIMETYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
        'image/tiff'
    ]
    
    def __init__(self):
        """Initialize Google Drive client with service account credentials."""
        self.service = self._authenticate()
    
    def _authenticate(self):
        """Authenticate using service account credentials."""
        service_account_email = os.getenv('GOOGLE_SERVICE_ACCOUNT_EMAIL')
        private_key = os.getenv('GOOGLE_PRIVATE_KEY')
        
        if not service_account_email or not private_key:
            # Try loading from JSON file
            json_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS') or 'google.json'
            if os.path.exists(json_path):
                logger.info(f"Using credentials from {json_path}")
                credentials = service_account.Credentials.from_service_account_file(
                    json_path, scopes=self.SCOPES
                )
            else:
                raise ValueError(
                    "Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and "
                    "GOOGLE_PRIVATE_KEY, or provide GOOGLE_APPLICATION_CREDENTIALS path."
                )
        else:
            # Handle escaped newlines in private key
            private_key = private_key.replace('\\n', '\n')
            
            credentials_info = {
                "type": "service_account",
                "client_email": service_account_email,
                "private_key": private_key,
                "token_uri": "https://oauth2.googleapis.com/token"
            }
            
            credentials = service_account.Credentials.from_service_account_info(
                credentials_info, scopes=self.SCOPES
            )
        
        return build('drive', 'v3', credentials=credentials)
    
    def list_images_in_folder(self, folder_id: str, page_size: int = 100) -> List[Dict]:
        """
        List all images in a Google Drive folder.
        
        Args:
            folder_id: Google Drive folder ID
            page_size: Number of results per page
            
        Returns:
            List of file metadata dictionaries
        """
        images = []
        page_token = None
        
        # Build MIME type query
        mime_query = " or ".join([f"mimeType='{mt}'" for mt in self.IMAGE_MIMETYPES])
        query = f"'{folder_id}' in parents and ({mime_query}) and trashed=false"
        
        while True:
            try:
                response = self.service.files().list(
                    q=query,
                    pageSize=page_size,
                    fields="nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime)",
                    pageToken=page_token
                ).execute()
                
                images.extend(response.get('files', []))
                page_token = response.get('nextPageToken')
                
                if not page_token:
                    break
                    
            except Exception as e:
                logger.error(f"Error listing files in folder {folder_id}: {e}")
                break
        
        logger.info(f"Found {len(images)} images in folder {folder_id}")
        return images
    
    def download_file(self, file_id: str, max_retries: int = 3) -> Optional[bytes]:
        """
        Download a file from Google Drive with retry logic.
        
        Args:
            file_id: Google Drive file ID
            max_retries: Maximum number of retry attempts
            
        Returns:
            File content as bytes, or None on error
        """
        import time
        
        for attempt in range(max_retries):
            try:
                # Create a fresh service for each retry to avoid connection issues
                request = self.service.files().get_media(fileId=file_id)
                file_stream = io.BytesIO()
                downloader = MediaIoBaseDownload(file_stream, request)
                
                done = False
                while not done:
                    _, done = downloader.next_chunk()
                
                return file_stream.getvalue()
                
            except Exception as e:
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + 1  # Exponential backoff: 2, 3, 5 seconds
                    logger.warning(f"Retry {attempt + 1}/{max_retries} for file {file_id}, waiting {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    logger.error(f"Failed to download file {file_id} after {max_retries} attempts: {e}")
                    return None
        
        return None


class S3Client:
    """AWS S3 client for uploading files."""
    
    def __init__(self):
        """Initialize S3 client with AWS credentials."""
        self.bucket_name = os.getenv('S3_BUCKET_NAME')
        
        if not self.bucket_name:
            raise ValueError("S3_BUCKET_NAME environment variable is required")
        
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'ap-south-1')
        )
        
        # Verify bucket exists
        self._verify_bucket()
    
    def _verify_bucket(self):
        """Verify the S3 bucket exists and is accessible."""
        try:
            self.s3.head_bucket(Bucket=self.bucket_name)
            logger.info(f"Connected to S3 bucket: {self.bucket_name}")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == '404':
                raise ValueError(f"S3 bucket '{self.bucket_name}' does not exist")
            elif error_code == '403':
                raise ValueError(f"Access denied to S3 bucket '{self.bucket_name}'")
            else:
                raise
    
    def file_exists(self, key: str) -> bool:
        """Check if a file already exists in S3."""
        try:
            self.s3.head_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError:
            return False
    
    def upload_file(self, content: bytes, key: str, content_type: str) -> bool:
        """
        Upload a file to S3.
        
        Args:
            content: File content as bytes
            key: S3 object key (path)
            content_type: MIME type of the file
            
        Returns:
            True if upload successful, False otherwise
        """
        try:
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=content,
                ContentType=content_type,
                # Make publicly readable (optional - remove if not needed)
                # ACL='public-read'
            )
            return True
        except Exception as e:
            logger.error(f"Error uploading to S3 key {key}: {e}")
            return False
    
    def get_public_url(self, key: str) -> str:
        """Get the public URL for an S3 object."""
        region = os.getenv('AWS_REGION', 'ap-south-1')
        return f"https://{self.bucket_name}.s3.{region}.amazonaws.com/{key}"


class GDriveToS3Sync:
    """Main class to sync Google Drive images to S3."""
    
    def __init__(self, max_workers: int = 5):
        """
        Initialize the sync manager.
        
        Args:
            max_workers: Maximum number of concurrent transfers
        """
        self.gdrive = GoogleDriveClient()
        self.s3 = S3Client()
        self.max_workers = max_workers
        self.stats = {
            'total': 0,
            'uploaded': 0,
            'skipped': 0,
            'failed': 0
        }
    
    def _get_s3_key(self, folder_name: str, file_name: str) -> str:
        """Generate S3 key for a file."""
        # Sanitize folder and file names
        folder_name = folder_name.replace(' ', '_').lower()
        return f"gallery/{folder_name}/{file_name}"
    
    def _transfer_file(self, file_info: Dict, folder_name: str) -> Dict:
        """
        Transfer a single file from Google Drive to S3.
        
        Args:
            file_info: File metadata from Google Drive
            folder_name: Display name for the folder
            
        Returns:
            Result dictionary with status
        """
        file_id = file_info['id']
        file_name = file_info['name']
        mime_type = file_info['mimeType']
        s3_key = self._get_s3_key(folder_name, file_name)
        
        result = {
            'file_name': file_name,
            'status': 'unknown',
            's3_key': s3_key
        }
        
        # Check if file already exists in S3
        if self.s3.file_exists(s3_key):
            result['status'] = 'skipped'
            logger.info(f"⏭️ Skipped (exists): {file_name}")
            return result
        
        # Download from Google Drive
        content = self.gdrive.download_file(file_id)
        if content is None:
            result['status'] = 'failed'
            result['error'] = 'Download failed'
            return result
        
        # Upload to S3
        if self.s3.upload_file(content, s3_key, mime_type):
            result['status'] = 'uploaded'
            result['url'] = self.s3.get_public_url(s3_key)
            result['size'] = len(content)
            logger.info(f"✅ Uploaded: {file_name} -> {s3_key}")
        else:
            result['status'] = 'failed'
            result['error'] = 'Upload failed'
        
        return result
    
    def sync_folder(self, folder_id: str, folder_name: str) -> List[Dict]:
        """
        Sync all images from a Google Drive folder to S3.
        
        Args:
            folder_id: Google Drive folder ID
            folder_name: Display name for the folder
            
        Returns:
            List of transfer results
        """
        logger.info(f"\n{'='*60}")
        logger.info(f"📁 Syncing folder: {folder_name} ({folder_id})")
        logger.info(f"{'='*60}")
        
        # List all images in folder
        images = self.gdrive.list_images_in_folder(folder_id)
        
        if not images:
            logger.warning(f"No images found in folder: {folder_name}")
            return []
        
        results = []
        
        # Transfer files concurrently
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {
                executor.submit(self._transfer_file, img, folder_name): img
                for img in images
            }
            
            for future in as_completed(futures):
                result = future.result()
                results.append(result)
                
                # Update stats
                self.stats['total'] += 1
                if result['status'] == 'uploaded':
                    self.stats['uploaded'] += 1
                elif result['status'] == 'skipped':
                    self.stats['skipped'] += 1
                else:
                    self.stats['failed'] += 1
        
        return results
    
    def sync_all_folders(self) -> Dict:
        """
        Sync all configured Google Drive folders to S3.
        
        Returns:
            Dictionary with sync results and statistics
        """
        folder_ids = os.getenv('GOOGLE_DRIVE_FOLDER_IDS', '').split(',')
        folder_names = os.getenv('GOOGLE_DRIVE_FOLDER_NAMES', '').split(',')
        
        # Filter out empty values
        folder_ids = [f.strip() for f in folder_ids if f.strip()]
        folder_names = [n.strip() for n in folder_names if n.strip()]
        
        if not folder_ids:
            raise ValueError(
                "No folders configured. Set GOOGLE_DRIVE_FOLDER_IDS in your .env file."
            )
        
        # Ensure we have names for all folders
        while len(folder_names) < len(folder_ids):
            folder_names.append(f"folder_{len(folder_names) + 1}")
        
        logger.info(f"\n🚀 Starting sync of {len(folder_ids)} folder(s)...")
        
        all_results = {}
        start_time = datetime.now()
        
        for folder_id, folder_name in zip(folder_ids, folder_names):
            results = self.sync_folder(folder_id, folder_name)
            all_results[folder_name] = results
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        # Print summary
        logger.info(f"\n{'='*60}")
        logger.info("📊 SYNC COMPLETE - SUMMARY")
        logger.info(f"{'='*60}")
        logger.info(f"Total files processed: {self.stats['total']}")
        logger.info(f"✅ Uploaded: {self.stats['uploaded']}")
        logger.info(f"⏭️ Skipped (already exists): {self.stats['skipped']}")
        logger.info(f"❌ Failed: {self.stats['failed']}")
        logger.info(f"⏱️ Duration: {duration:.2f} seconds")
        logger.info(f"{'='*60}\n")
        
        return {
            'results': all_results,
            'stats': self.stats,
            'duration_seconds': duration
        }


def main():
    """Main entry point."""
    try:
        # Create syncer and run
        syncer = GDriveToS3Sync(max_workers=2)  # Reduced to avoid SSL issues
        results = syncer.sync_all_folders()
        
        # Save results to JSON file
        output_file = f"sync_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        logger.info(f"📄 Results saved to: {output_file}")
        
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise


if __name__ == '__main__':
    main()
