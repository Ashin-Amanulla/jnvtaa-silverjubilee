# Nginx Configuration for Large File Uploads

## Problem
Nginx has a default `client_max_body_size` of **1MB**, which will block your 20MB image uploads even though the backend accepts them.

## Solution
Update your nginx configuration to allow larger uploads.

## Quick Fix

### Step 1: Edit Your Backend API Nginx Config

```bash
sudo nano /etc/nginx/sites-available/backend-api
```

### Step 2: Add These Settings

Add these lines **inside the `server` block** (before the `location /` block):

```nginx
# Increase client body size for large image uploads (25MB)
client_max_body_size 30M;

# Increase buffer sizes for large uploads
client_body_buffer_size 128k;

# Increase timeouts for large file uploads
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
send_timeout 300s;
```

### Step 3: Update Location Block

Inside the `location /` block, add:

```nginx
# Disable buffering for large uploads (allows streaming)
proxy_request_buffering off;
proxy_buffering off;
```

### Step 4: Test and Reload

```bash
# Test configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

## Complete Example

Here's a complete nginx config for your backend API:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # CRITICAL: Allow large file uploads
    client_max_body_size 30M;
    client_body_buffer_size 128k;
    
    # Timeouts for large uploads
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    send_timeout 300s;

    location / {
        proxy_pass http://localhost:5454;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Disable buffering for large uploads
        proxy_request_buffering off;
        proxy_buffering off;
    }
}
```

## Alternative: Global Setting

If you want to set this globally for all sites, edit the main nginx config:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside the `http` block:

```nginx
http {
    # ... existing settings ...
    
    # Global setting for all sites
    client_max_body_size 30M;
    
    # ... rest of config ...
}
```

Then reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Verify It Works

After updating, test with a large image upload. You should see:
- ✅ Upload succeeds (no 413 Request Entity Too Large error)
- ✅ Image gets compressed on the server
- ✅ Smaller file size uploaded to S3

## Troubleshooting

### Still getting 413 errors?
1. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify config: `sudo nginx -t`
3. Make sure you reloaded: `sudo systemctl reload nginx`
4. Check if there are multiple nginx configs overriding each other

### Upload times out?
- Increase the timeout values further (600s, 900s)
- Check backend logs for processing time
- Consider increasing Docker container memory limits

## Settings Explained

- **`client_max_body_size 30M`**: Maximum upload size (30MB allows 25MB + overhead)
- **`client_body_buffer_size 128k`**: Buffer size for reading request body
- **`proxy_*_timeout 300s`**: Timeouts for proxy operations (5 minutes)
- **`proxy_request_buffering off`**: Stream uploads directly to backend (better for large files)
- **`proxy_buffering off`**: Don't buffer responses (useful for streaming)
