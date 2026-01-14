# Google Service Account Setup Guide

Follow these steps to create a Service Account for the gallery feature.

## Step 1: Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: **jnvtaa**

## Step 2: Enable Google Drive API

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and click **Enable** (if not already enabled)

## Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **Service Account**
4. Fill in the details:
   - **Service account name**: `gallery-service` (or any name you prefer)
   - **Service account ID**: Will auto-generate (e.g., `gallery-service@jnvtaa.iam.gserviceaccount.com`)
   - **Description**: "Service account for photo gallery Google Drive access"
5. Click **CREATE AND CONTINUE**
6. Skip the optional steps (Grant access, Grant users access)
7. Click **DONE**

## Step 4: Create and Download Key

1. You'll see your new service account in the list
2. Click on the service account email to open it
3. Go to the **KEYS** tab
4. Click **ADD KEY** → **Create new key**
5. Select **JSON** format
6. Click **CREATE**
7. A JSON file will download automatically - **save this file securely!**

## Step 5: Extract Credentials from JSON

The downloaded JSON file will look like this:

```json
{
  "type": "service_account",
  "project_id": "jnvtaa",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "gallery-service@jnvtaa.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

You need two values:
- `client_email` → This is your **GOOGLE_SERVICE_ACCOUNT_EMAIL**
- `private_key` → This is your **GOOGLE_PRIVATE_KEY**

## Step 6: Add to .env File

Open `backend/.env` and add:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=gallery-service@jnvtaa.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Actual-Private-Key-Here\n-----END PRIVATE KEY-----"
```

**Important:** Keep the quotes around the private key and preserve the `\n` characters!

## Step 7: Get Your Folder IDs

1. Open Google Drive in your browser
2. Navigate to each folder you want in the gallery
3. Look at the URL: `https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j`
4. Copy the folder ID (the part after `/folders/`)
5. Repeat for all folders

## Step 8: Configure Folders in .env

Add to `backend/.env`:

```bash
# Example with 3 folders
GOOGLE_DRIVE_FOLDER_IDS=1a2b3c4d5e6f7g8h9i0j,9i8h7g6f5e4d3c2b1a0,abcdefghijklmnop
GOOGLE_DRIVE_FOLDER_NAMES=Opening Ceremony,Cultural Events,Closing Ceremony
```

**Note:** 
- Folder IDs and names must be in the same order
- Use commas to separate multiple values
- No spaces around commas

## Step 9: Share Folders with Service Account

For each Google Drive folder:

1. Right-click the folder → **Share**
2. Paste your service account email: `gallery-service@jnvtaa.iam.gserviceaccount.com`
3. Set permission to **Viewer**
4. Uncheck "Notify people" (service accounts don't need notifications)
5. Click **Share**

## Step 10: Restart Backend Server

```bash
# Stop the current server (Ctrl+C in the terminal)
# Then restart:
cd backend
npm run dev
```

## Step 11: Test the Gallery

1. Open your browser to `http://localhost:5173/gallery`
2. You should see your images loading!
3. Test folder filtering
4. Click an image to open the lightbox

## Troubleshooting

### "Permission denied" error
- Make sure you shared the folders with the service account email
- Verify the email in .env matches the service account email exactly

### "Invalid credentials" error
- Check that the private key is copied correctly with all `\n` characters
- Ensure quotes are around the private key in .env

### No images showing
- Verify folder IDs are correct
- Make sure folders contain image files (JPEG, PNG, GIF, WebP)
- Check that images are not in trash

---

**Security Reminder:** Never commit the service account JSON file or the `.env` file to git!
