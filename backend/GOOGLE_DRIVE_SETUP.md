# Google Drive Gallery Configuration Guide

This guide will help you configure the Google Drive API credentials for the gallery feature.

## Step 1: Add Environment Variables

Add the following variables to your backend `.env` file:

### Option A: Service Account (Recommended)

```bash
# Google Drive Service Account Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"

# Folder Configuration
GOOGLE_DRIVE_FOLDER_IDS=folder_id_1,folder_id_2,folder_id_3
GOOGLE_DRIVE_FOLDER_NAMES=Event Day 1,Ceremony Photos,Group Photos
```

### Option B: OAuth 2.0 (Alternative)

```bash
# Google Drive OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth2callback
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Folder Configuration
GOOGLE_DRIVE_FOLDER_IDS=folder_id_1,folder_id_2,folder_id_3
GOOGLE_DRIVE_FOLDER_NAMES=Event Day 1,Ceremony Photos,Group Photos
```

## Step 2: Get Your Folder IDs

1. Open Google Drive in your browser
2. Navigate to the folder you want to display
3. Look at the URL: `https://drive.google.com/drive/folders/[FOLDER_ID_HERE]`
4. Copy the folder ID
5. Repeat for all folders you want to include

## Step 3: Share Folders with Service Account

If using Service Account authentication:

1. Copy your service account email (from Google Cloud Console)
2. For each folder in Google Drive:
   - Right-click the folder → Share
   - Paste the service account email
   - Give "Viewer" permission
   - Click "Send"

## Step 4: Restart Backend Server

After updating the `.env` file:

```bash
cd backend
# Stop the current server (Ctrl+C)
npm run dev
```

## Example Configuration

Here's a complete example:

```bash
# .env file
GOOGLE_SERVICE_ACCOUNT_EMAIL=gallery-service@jnvta-2026.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_FOLDER_IDS=1a2b3c4d5e6f7g8h9i0j,9i8h7g6f5e4d3c2b1a0,abcdefghijklmnop
GOOGLE_DRIVE_FOLDER_NAMES=Opening Ceremony,Cultural Events,Closing Ceremony
```

## Troubleshooting

### Error: "Google Drive credentials not configured"
- Make sure all required environment variables are set in `.env`
- Verify the `.env` file is in the `backend` directory
- Restart the backend server

### Error: "Failed to fetch gallery images"
- Check that folders are shared with the service account email
- Verify folder IDs are correct
- Ensure the service account has "Viewer" permission

### Images not loading
- Check that folders contain image files (JPEG, PNG, GIF, WebP)
- Verify images are not in trash
- Check browser console for CORS errors

## Testing

1. Navigate to `http://localhost:3000/gallery` (or your frontend URL)
2. You should see folder tabs and images loading
3. Click an image to open the lightbox
4. Test navigation with arrow keys or buttons

## Security Notes

- Never commit the `.env` file to git (it's already in `.gitignore`)
- Keep your private key secure
- Use service account for production deployments
- Regularly rotate credentials
