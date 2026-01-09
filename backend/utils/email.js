const nodemailer = require("nodemailer");
require("dotenv").config();

const validateEmailConfig = () => {
  const requiredVars = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required email environment variables: ${missing.join(", ")}`
    );
  }
};

const createTransporter = (options = {}) => {
  validateEmailConfig();

  const port = parseInt(options.port || process.env.SMTP_PORT || "465", 10);
  const isSecure = port === 465;

  // Hostinger SMTP configuration
  // Port 465 requires secure: true with SSL/TLS
  const config = {
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: port,
    secure: isSecure, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER, // admin@jnvtaa.in
      pass: process.env.SMTP_PASS,
    },
    // Connection pooling for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    // Connection timeouts
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
  };

  // For TLS (port 587), add requireTLS option
  if (!isSecure && (port === 587 || port === 2525)) {
    config.requireTLS = true;
    config.tls = {
      // Hostinger uses valid certificates, so we can verify them
      rejectUnauthorized: true,
    };
  }

  // For SSL (port 465) - Hostinger uses proper SSL certificates
  if (isSecure) {
    config.tls = {
      // Verify SSL certificate (Hostinger has valid certs)
      rejectUnauthorized: true,
    };
  }

  return nodemailer.createTransport(config);
};

// Verify transporter connection
const verifyTransporter = async (transporter) => {
  try {
    await transporter.verify();
    return { success: true };
  } catch (error) {
    // Enhanced error logging to identify connection vs authentication issues
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response,
      command: error.command,
    };

    // Categorize error types
    if (error.code === "ETIMEDOUT" || error.code === "ECONNRESET" || error.code === "ECONNREFUSED") {
      errorDetails.type = "CONNECTION_ERROR";
      errorDetails.description = "Network/firewall blocking SMTP port or server unreachable";
    } else if (error.code === "EAUTH") {
      errorDetails.type = "AUTHENTICATION_ERROR";
      errorDetails.description = "Invalid SMTP credentials";
    } else if (error.code === "ESOCKET" || error.code === "ETIMEDOUT") {
      errorDetails.type = "SOCKET_ERROR";
      errorDetails.description = "Socket connection issue - check firewall/network settings";
    } else {
      errorDetails.type = "UNKNOWN_ERROR";
      errorDetails.description = "Unknown SMTP error";
    }

    return {
      success: false,
      ...errorDetails,
    };
  }
};

// Development mode email handler (for blocked SMTP ports on local networks)
const sendEmailDevMode = (registration) => {
  const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER || "info@jnvtaa.in";

  console.log("📧 [DEV MODE] Email would be sent (SMTP ports blocked on local network):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`From: ${emailFrom}`);
  console.log(`To: ${registration.email}`);
  console.log(`Subject: JNVTA Silver Jubilee 2026 - Registration Successful`);
  console.log(`Registration ID: ${registration.registrationId}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ℹ️  Note: Emails will be sent automatically in production environment");
  console.log("ℹ️  Local networks often block SMTP ports (465, 587) - this is normal\n");

  return {
    success: true,
    devMode: true,
    message: "Email logged (development mode - SMTP ports blocked)",
  };
};

const sendSuccessEmail = async (registration) => {
  // Check if we're in development mode and SMTP ports might be blocked
  const isDevelopment = process.env.NODE_ENV === "development";
  const skipSmtpCheck = process.env.SKIP_SMTP === "true";

  // For development, try to send but fallback gracefully
  if (isDevelopment && skipSmtpCheck) {
    return sendEmailDevMode(registration);
  }

  // Hostinger primarily uses port 465 with SSL
  // Try 465 first, then 587 as fallback
  const portsToTry = [
    parseInt(process.env.SMTP_PORT || "465", 10),
    465, // Primary SSL port for Hostinger
    587, // STARTTLS fallback
  ].filter((port, index, self) => self.indexOf(port) === index); // Remove duplicates

  let lastError = null;
  let lastErrorDetails = null;

  for (const port of portsToTry) {
    try {
      console.log(`📧 Attempting to send email using SMTP port ${port}...`);
      const transporter = createTransporter({ port });

      // Verify connection first
      const verification = await verifyTransporter(transporter);
      if (!verification.success) {
        console.warn(`⚠️  SMTP verification failed for port ${port}:`);
        console.warn(`   Error Type: ${verification.type || "UNKNOWN"}`);
        console.warn(`   Description: ${verification.description || verification.message}`);
        console.warn(`   Code: ${verification.code}`);

        lastError = new Error(verification.message);
        lastErrorDetails = verification;

        // If it's a connection error and we're in dev mode, suggest dev mode
        if (isDevelopment && verification.type === "CONNECTION_ERROR") {
          console.warn(`   💡 Tip: Set SKIP_SMTP=true in .env to enable dev mode for local testing`);
        }

        continue; // Try next port
      }

      console.log(`✅ SMTP connection verified successfully on port ${port}`);

      const message = `
    Dear ${registration.name},
        Thank you for registering for JNVTA Silver Jubilee 2026 Alumni Meet. Your registration has been successful.

        Registration ID: ${registration.registrationId}
        Name: ${registration.name}
        Email: ${registration.email}
        Mobile Number: ${registration.mobile}
        Batch: ${registration.batch}
        Food Choice: ${registration.foodChoice}
        Number of Attendees: ${registration.attendees.adults + registration.attendees.children + registration.attendees.infants}
        Contribution Amount: ${registration.contributionAmount}
        Payment Transaction ID: ${registration.paymentTransactionId}

        We look forward to seeing you at JNVTA Silver Jubilee 2026!

    Regards,
        JNVTA Silver Jubilee Team
    `;
      const subject = "JNVTA Silver Jubilee 2026 - Registration Successful";

      // Support email alias - use EMAIL_FROM if set, otherwise use SMTP_USER
      // Hostinger allows sending from aliases when authenticated with main account
      const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER;

      const mailOptions = {
        from: emailFrom, // Can be info@jnvtaa.in (alias) while auth is admin@jnvtaa.in
        to: registration.email,
        subject,
        text: message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Message sent successfully using port ${port}: ${info.messageId}`);
      console.log(`   From: ${emailFrom}`);
      console.log(`   To: ${registration.email}`);

      return { success: true, messageId: info.messageId, port, from: emailFrom };
    } catch (error) {
      // Enhanced error logging
      console.error(`❌ Failed to send email using port ${port}:`);
      console.error(`   Error: ${error.message}`);
      console.error(`   Code: ${error.code || "N/A"}`);

      if (error.response) {
        console.error(`   SMTP Response: ${error.response}`);
      }
      if (error.command) {
        console.error(`   Command: ${error.command}`);
      }

      // Categorize error
      if (error.code === "ETIMEDOUT" || error.code === "ECONNRESET" || error.code === "ECONNREFUSED") {
        console.error(`   Type: CONNECTION_ERROR - Network/firewall may be blocking SMTP port ${port}`);
        if (isDevelopment) {
          console.error(`   💡 Development Tip: Local networks often block SMTP ports. Test on production server.`);
        }
      } else if (error.code === "EAUTH") {
        console.error(`   Type: AUTHENTICATION_ERROR - Check SMTP_USER and SMTP_PASS credentials`);
      }

      // If it's an authentication error and we haven't tried all ports, continue
      if (error.code === "EAUTH" && port !== portsToTry[portsToTry.length - 1]) {
        lastError = error;
        lastErrorDetails = {
          type: "AUTHENTICATION_ERROR",
          code: error.code,
          message: error.message,
        };
        continue;
      }

      // If it's not an auth error or it's the last port, save the error
      lastError = error;
      lastErrorDetails = {
        type: error.code === "EAUTH" ? "AUTHENTICATION_ERROR" :
          (error.code === "ETIMEDOUT" || error.code === "ECONNRESET") ? "CONNECTION_ERROR" : "UNKNOWN_ERROR",
        code: error.code,
        message: error.message,
        response: error.response,
      };
    }
  }

  // All ports failed - provide detailed error message
  let errorMessage;
  if (lastErrorDetails?.type === "AUTHENTICATION_ERROR") {
    errorMessage = `SMTP Authentication failed. Please check your SMTP_USER and SMTP_PASS environment variables. Tried ports: ${portsToTry.join(", ")}`;
  } else if (lastErrorDetails?.type === "CONNECTION_ERROR") {
    errorMessage = `SMTP Connection failed. Network/firewall may be blocking SMTP ports (${portsToTry.join(", ")}). This is common on local development machines. Emails will work on production servers.`;
    if (isDevelopment) {
      errorMessage += ` Set SKIP_SMTP=true in .env to enable dev mode.`;
    }
  } else {
    errorMessage = lastError?.message || "Unknown error occurred";
  }

  console.error("❌ All SMTP connection attempts failed");
  console.error(`   Tried ports: ${portsToTry.join(", ")}`);
  console.error(`   Error type: ${lastErrorDetails?.type || "UNKNOWN"}`);

  return {
    success: false,
    error: errorMessage,
    triedPorts: portsToTry,
    errorDetails: lastErrorDetails,
  };
};

// Background email sending - fire and forget
const sendSuccessEmailBackground = (registration) => {
  // Use setImmediate to make it truly asynchronous and non-blocking
  setImmediate(async () => {
    try {
      const result = await sendSuccessEmail(registration);

      // Update database status after sending
      const Registration = require("../models/Registration");
      const registrationId = registration._id || (registration.id ? registration.id.toString() : null);

      if (!registrationId) {
        console.error("Cannot update email status: registration ID not found");
        return;
      }

      const updatedRegistration = await Registration.findById(registrationId);

      if (updatedRegistration) {
        if (result.success) {
          updatedRegistration.isEmailSent = !result.devMode; // Only mark as sent if not dev mode
          await updatedRegistration.save();

          if (result.devMode) {
            console.log(`📧 [DEV MODE] Email logged for ${updatedRegistration.email} (not actually sent)`);
          } else {
            console.log(`✅ Background email sent successfully to ${updatedRegistration.email}`);
            if (result.from) {
              console.log(`   Sent from: ${result.from}`);
            }
          }
        } else {
          updatedRegistration.isEmailSent = false;
          await updatedRegistration.save();
          console.error(`❌ Background email failed for ${updatedRegistration.email}:`, result.error);
          if (result.errorDetails) {
            console.error(`   Error Type: ${result.errorDetails.type}`);
            console.error(`   Error Code: ${result.errorDetails.code}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Background email error:`, error.message);
      console.error(`   Stack:`, error.stack);

      // Try to update status even on error
      try {
        const Registration = require("../models/Registration");
        const registrationId = registration._id || (registration.id ? registration.id.toString() : null);

        if (registrationId) {
          const updatedRegistration = await Registration.findById(registrationId);
          if (updatedRegistration) {
            updatedRegistration.isEmailSent = false;
            await updatedRegistration.save();
          }
        }
      } catch (dbError) {
        console.error("Error updating email status in database:", dbError);
      }
    }
  });
};

module.exports = {
  sendSuccessEmail,
  sendSuccessEmailBackground,
};
