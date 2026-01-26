# Update Your Nginx Config for Large File Uploads

## Your Current Setup
- Domain: `jnvtaa.in`
- Frontend: `/var/www/jnvtaa`
- API Proxy: `/api/` → `http://127.0.0.1:5454/`
- SSL: Configured via Certbot

## What to Add

You need to add these settings to handle 20MB+ image uploads.

## Step-by-Step Instructions

### 1. Backup Your Current Config
```bash
sudo cp /etc/nginx/sites-available/jnvtaa.in /etc/nginx/sites-available/jnvtaa.in.backup
```

### 2. Edit Your Config
```bash
sudo nano /etc/nginx/sites-available/jnvtaa.in
```

### 3. Add These Lines

**Add at the top of the `server` block** (right after `server_name`):

```nginx
# ========== LARGE FILE UPLOAD SETTINGS ==========
# Allow up to 30MB uploads (25MB + overhead)
client_max_body_size 30M;
client_body_buffer_size 128k;

# Increase timeouts for large file uploads (5 minutes)
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
send_timeout 300s;
```

**Inside the `location /api/` block**, add these lines (after the existing proxy_set_header lines):

```nginx
# CRITICAL: Disable buffering for large uploads (allows streaming)
proxy_request_buffering off;
proxy_buffering off;
```

### 4. Your Complete Updated Config Should Look Like:

```nginx
server {
    server_name jnvtaa.in www.jnvtaa.in;

    # ========== LARGE FILE UPLOAD SETTINGS ==========
    client_max_body_size 30M;
    client_body_buffer_size 128k;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    send_timeout 300s;

    # ---------- FRONTEND ----------
    root /var/www/jnvtaa;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # ---------- API ----------
    location /api/ {
        proxy_pass http://127.0.0.1:5454/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;

        # CRITICAL: Disable buffering for large uploads
        proxy_request_buffering off;
        proxy_buffering off;
    }

    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/jnvtaa.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jnvtaa.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.jnvtaa.in) {
        return 301 https://$host$request_uri;
    }

    if ($host = jnvtaa.in) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    listen [::]:80;
    server_name jnvtaa.in www.jnvtaa.in;
    return 404;
}
```

### 5. Test Configuration
```bash
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6. Reload Nginx
```bash
sudo systemctl reload nginx
```

### 7. Verify It Works
Try uploading a 20MB image through your gallery upload feature. It should:
- ✅ Not show "413 Request Entity Too Large" error
- ✅ Upload successfully
- ✅ Get compressed on the backend
- ✅ Store smaller file in S3

## What Changed?

| Setting | Before | After | Why |
|---------|--------|-------|-----|
| `client_max_body_size` | 1MB (default) | 30M | Allows 25MB uploads + overhead |
| `proxy_*_timeout` | 60s | 300s | More time for large file processing |
| `proxy_request_buffering` | on (default) | off | Streams uploads directly (better for large files) |
| `proxy_buffering` | on (default) | off | Prevents memory issues with large files |

## Troubleshooting

### Still getting 413 errors?
1. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify the config was saved correctly: `sudo cat /etc/nginx/sites-available/jnvtaa.in | grep client_max_body_size`
3. Make sure you reloaded: `sudo systemctl reload nginx`
4. Check if there's a global limit overriding: `sudo grep -r "client_max_body_size" /etc/nginx/`

### Upload times out?
- Check backend logs: `docker logs jnvtaa-backend` or `pm2 logs`
- Verify backend is processing: Check if compression is happening
- Increase timeouts further if needed (600s, 900s)

### Certbot warnings?
- Don't worry about Certbot-managed sections
- The settings we added won't interfere with SSL
- Certbot will preserve your custom settings

## Quick Copy-Paste Version

If you want to quickly update just the API location block:

```bash
sudo nano /etc/nginx/sites-available/jnvtaa.in
```

Find the `location /api/` block and make sure it includes:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:5454/;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;

    # CRITICAL: Disable buffering for large uploads
    proxy_request_buffering off;
    proxy_buffering off;
}
```

And add at the top of the server block:

```nginx
client_max_body_size 30M;
client_body_buffer_size 128k;
send_timeout 300s;
```
