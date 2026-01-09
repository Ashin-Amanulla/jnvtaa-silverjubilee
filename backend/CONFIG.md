# Configuration Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/onam-registration
# For production, use: mongodb+srv://username:password@cluster.mongodb.net/onam-registration

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin Configuration
ADMIN_EMAIL=admin@unmabangalore.com
ADMIN_PASSWORD=admin123

# Payment Configuration
PAYMENT_VERIFICATION_ENABLED=false

# Email Configuration (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=admin@jnvtaa.in
SMTP_PASS=your_email_password
EMAIL_FROM=info@jnvtaa.in  # Optional: Use alias for sending (authenticate with SMTP_USER)

# Development Mode (for local testing when SMTP ports are blocked)
# Set SKIP_SMTP=true to enable dev mode (emails will be logged instead of sent)
SKIP_SMTP=false
```

## Quick Setup

1. Copy the environment variables above into a `.env` file
2. Install dependencies: `npm install`
3. Start MongoDB service
4. Run the application: `npm run dev`
5. Seed the database (optional): `npm run seed`

## MongoDB Setup

### Local MongoDB

```bash
# Install MongoDB
# Start MongoDB service
mongod
```

### MongoDB Atlas (Cloud)

1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in .env file

## Email Configuration (Hostinger)

### SMTP Settings

The application uses Hostinger/Titan email for sending registration confirmation emails.

**Required Environment Variables:**

- `SMTP_HOST`: smtp.hostinger.com
- `SMTP_PORT`: 465 (SSL) or 587 (STARTTLS)
- `SMTP_USER`: Your main email account (e.g., admin@jnvtaa.in)
- `SMTP_PASS`: Your email account password
- `EMAIL_FROM`: (Optional) Email alias to send from (e.g., info@jnvtaa.in)

**Email Alias Support:**

- You can send emails from aliases (like `info@jnvtaa.in`) while authenticating with your main account (`admin@jnvtaa.in`)
- Set `EMAIL_FROM=info@jnvtaa.in` in your `.env` file
- The system will authenticate with `SMTP_USER` but send from `EMAIL_FROM`

### Local Development

**Important:** Many local networks and ISPs block SMTP ports (465, 587) to prevent spam. This is normal and expected.

**Options for Local Development:**

1. **Test on Production Server** (Recommended)

   - Deploy to your production environment (AWS, VPS, etc.)
   - Production servers typically don't have SMTP port restrictions
   - Emails will work automatically

2. **Development Mode** (For Testing)
   - Set `SKIP_SMTP=true` in your `.env` file
   - Set `NODE_ENV=development`
   - Emails will be logged to console instead of being sent
   - Useful for testing the registration flow without actual email delivery

**Example .env for Local Development:**

```env
NODE_ENV=development
SKIP_SMTP=true  # Enable dev mode
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=admin@jnvtaa.in
SMTP_PASS=your_password
EMAIL_FROM=info@jnvtaa.in
```

### Production Configuration

For production, ensure:

- `NODE_ENV=production` (or omit SKIP_SMTP)
- `SKIP_SMTP=false` or remove it
- Valid SMTP credentials
- Production servers typically allow SMTP connections

**Troubleshooting:**

- **Connection Timeout/Reset**: Usually means SMTP ports are blocked (common on local networks)
- **Authentication Error**: Check `SMTP_USER` and `SMTP_PASS` credentials
- **SSL Certificate Error**: Hostinger uses valid certificates - ensure `rejectUnauthorized: true` (default)
