# Google Drive to S3 Transfer Script

A Python script to transfer images from Google Drive folders to AWS S3 bucket.

## Prerequisites

1. **Google Cloud Service Account** (you already have this ✅)
2. **AWS Account with S3 access**
3. **Python 3.8+**

---

## Setup Procedure

### Step 1: Install Dependencies

```bash
cd backend/scripts
pip install -r requirements-gdrive-s3.txt
```

### Step 2: AWS Setup

#### 2.1 Create an S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. Enter bucket name (e.g., `jnvta-gallery-images`)
4. Select region (e.g., `ap-south-1` for Mumbai)
5. Keep other settings as default and create

#### 2.2 Create IAM User for S3 Access

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Enter username (e.g., `gdrive-s3-sync`)
4. Click **Next**
5. Select **Attach policies directly**
6. Search and select `AmazonS3FullAccess` (or create a custom policy for specific bucket)
7. Click **Create user**
8. Click on the created user → **Security credentials** tab
9. Click **Create access key** → Select **Application outside AWS**
10. **Save the Access Key ID and Secret Access Key** (you'll need these!)

### Step 3: Configure Environment Variables

Add these to your `.env` file in the backend folder:

```env
# ============================================
# GOOGLE DRIVE CONFIGURATION (existing)
# ============================================
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Google Drive folder IDs to sync
GOOGLE_DRIVE_FOLDER_IDS=folder_id_1,folder_id_2,folder_id_3
GOOGLE_DRIVE_FOLDER_NAMES=Opening Ceremony,Cultural Events,Closing Ceremony

# ============================================
# AWS S3 CONFIGURATION (new)
# ============================================
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=jnvta-gallery-images
```

### Step 4: Share Google Drive Folders

Make sure your Google Drive folders are shared with the service account email:

1. Open Google Drive
2. Right-click on each folder you want to sync
3. Click **Share**
4. Add your service account email (e.g., `your-service@your-project.iam.gserviceaccount.com`)
5. Set permission to **Viewer**
6. Click **Send**

---

## Running the Script

### Option 1: Run Directly

```bash
cd backend/scripts
python gdrive_to_s3.py
```

### Option 2: Run from Backend Root

```bash
cd backend
python scripts/gdrive_to_s3.py
```

---

## Script Features

- ✅ **Concurrent uploads** - Transfers multiple files simultaneously (5 workers by default)
- ✅ **Skip existing files** - Checks if file already exists in S3 before uploading
- ✅ **Supports all image types** - JPEG, PNG, GIF, WebP, BMP, SVG, TIFF
- ✅ **Detailed logging** - Logs to console and `gdrive_to_s3.log` file
- ✅ **Results export** - Saves sync results to JSON file
- ✅ **Progress tracking** - Shows upload progress and summary

---

## Output

After running, you'll see output like:

```
2024-01-14 20:15:00 - INFO - 🚀 Starting sync of 3 folder(s)...
2024-01-14 20:15:00 - INFO - ============================================================
2024-01-14 20:15:00 - INFO - 📁 Syncing folder: Opening Ceremony (abc123...)
2024-01-14 20:15:01 - INFO - Found 25 images in folder abc123...
2024-01-14 20:15:02 - INFO - ✅ Uploaded: photo1.jpg -> gallery/opening_ceremony/photo1.jpg
2024-01-14 20:15:03 - INFO - ⏭️ Skipped (exists): photo2.jpg
...
2024-01-14 20:16:00 - INFO - ============================================================
2024-01-14 20:16:00 - INFO - 📊 SYNC COMPLETE - SUMMARY
2024-01-14 20:16:00 - INFO - ============================================================
2024-01-14 20:16:00 - INFO - Total files processed: 100
2024-01-14 20:16:00 - INFO - ✅ Uploaded: 45
2024-01-14 20:16:00 - INFO - ⏭️ Skipped (already exists): 55
2024-01-14 20:16:00 - INFO - ❌ Failed: 0
2024-01-14 20:16:00 - INFO - ⏱️ Duration: 60.25 seconds
```

---

## S3 Folder Structure

Images are stored in S3 with this structure:

```
s3://your-bucket-name/
└── gallery/
    ├── opening_ceremony/
    │   ├── image1.jpg
    │   └── image2.png
    ├── cultural_events/
    │   ├── photo1.jpg
    │   └── photo2.webp
    └── closing_ceremony/
        └── final.jpg
```

---

## Accessing Images

After upload, images are available at:

```
https://{bucket-name}.s3.{region}.amazonaws.com/gallery/{folder_name}/{file_name}
```

Example:
```
https://jnvta-gallery-images.s3.ap-south-1.amazonaws.com/gallery/opening_ceremony/photo1.jpg
```

---

## Troubleshooting

### Error: "Access Denied" for Google Drive

- Verify the folder is shared with your service account email
- Check that `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` are correct

### Error: "Bucket not found" for S3

- Verify the bucket name is correct
- Make sure the bucket exists in the specified region

### Error: "Access Denied" for S3

- Check AWS credentials are correct
- Verify IAM user has S3 permissions

### Large number of images

- The script handles pagination automatically
- For very large folders (1000+ images), the script will take longer
- You can run it multiple times safely (existing files are skipped)

---

## Scheduling (Optional)

To run automatically every hour, add to crontab:

```bash
crontab -e
```

Add:
```
0 * * * * cd /path/to/backend/scripts && python gdrive_to_s3.py >> /var/log/gdrive_sync.log 2>&1
```
