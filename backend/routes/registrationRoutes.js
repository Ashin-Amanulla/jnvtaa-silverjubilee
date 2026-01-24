const express = require("express");
const router = express.Router();
const {
  createRegistration,
  getRegistrations,
  getRegistration,
  updateRegistration,
  deleteRegistration,
  getRegistrationStats,
  verifyRegistration,
  updatePaymentStatus,
  searchRegistration,
  downloadRegistrations,
  sendConfirmationEmail,
  searchForCheckin,
  selfCheckin,
  verifyRegistrationForCheckin,
  addGuests,
} = require("../controllers/registrationController");
const {
  validateRegistrationData,
  validateQueryParams,
  validateAddGuestsData,
} = require("../middlewares/validation");
const verifyToken = require("../middlewares/auth");
// Public routes
router.post("/", validateRegistrationData, createRegistration);

// Public check-in routes
router.get("/checkin/search", searchForCheckin);
router.get("/checkin/verify/:id", verifyRegistrationForCheckin);
router.post("/checkin/:id", selfCheckin);
router.post("/:id/add-guests", validateAddGuestsData, addGuests);

//create auth routes
router.use(verifyToken);
router.get("/search/:query", searchRegistration);

// Admin routes (these would typically be protected with authentication middleware)
router.get("/", getRegistrations);
router.get("/download", downloadRegistrations);
router.get("/stats/summary", getRegistrationStats);
router.get("/send-confirmation-email", sendConfirmationEmail);
router.get("/:id", getRegistration);
router.put("/:id", updateRegistration);
router.delete("/:id", deleteRegistration);
router.patch("/:id/verify", verifyRegistration);
router.patch("/:id/payment", updatePaymentStatus);
module.exports = router;
