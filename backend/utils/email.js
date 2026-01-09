const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const isSecure = port === 465;

  // Hostinger SMTP configuration
  const config = {
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: port,
    secure: isSecure, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // For TLS (port 587), add requireTLS option
  if (!isSecure && port === 587) {
    config.requireTLS = true;
    config.tls = {
      rejectUnauthorized: false, // Allow self-signed certificates if needed
    };
  }

  return nodemailer.createTransport(config);
};

const sendSuccessEmail = async (registration) => {
  try {
    const transporter = createTransporter();

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
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: registration.email,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Error details:", {
      code: error.code,
      response: error.response,
      command: error.command,
    });
    return { success: false, error: error.message };
  }
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
          updatedRegistration.isEmailSent = true;
          await updatedRegistration.save();
          console.log(`✅ Background email sent successfully to ${updatedRegistration.email}`);
        } else {
          updatedRegistration.isEmailSent = false;
          await updatedRegistration.save();
          console.error(`❌ Background email failed for ${updatedRegistration.email}:`, result.error);
        }
      }
    } catch (error) {
      console.error(`❌ Background email error:`, error.message);
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
