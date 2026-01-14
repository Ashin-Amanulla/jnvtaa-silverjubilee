const { google } = require('googleapis');
require('dotenv').config();

/**
 * Initialize Google Drive API client
 * Supports both Service Account and OAuth authentication
 */
function getDriveClient() {
    try {
        // Check if we're using Service Account authentication
        if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                },
                scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            });

            return google.drive({ version: 'v3', auth });
        }

        // Fallback to OAuth if service account not configured
        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
            });

            return google.drive({ version: 'v3', auth: oauth2Client });
        }

        throw new Error('Google Drive credentials not configured. Please set up Service Account or OAuth credentials in .env file.');
    } catch (error) {
        console.error('Error initializing Google Drive client:', error.message);
        throw error;
    }
}

/**
 * Get folder IDs from environment variable
 * @returns {Array} Array of folder configuration objects
 */
function getConfiguredFolders() {
    const folderIds = process.env.GOOGLE_DRIVE_FOLDER_IDS || '';
    const folderNames = process.env.GOOGLE_DRIVE_FOLDER_NAMES || '';

    const ids = folderIds.split(',').map(id => id.trim()).filter(Boolean);
    const names = folderNames.split(',').map(name => name.trim()).filter(Boolean);

    return ids.map((id, index) => ({
        id,
        name: names[index] || `Album ${index + 1}`,
    }));
}

module.exports = {
    getDriveClient,
    getConfiguredFolders,
};
