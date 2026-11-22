
const express = require("express");
const router = express.Router();

const {
    loginUser,
    createPatientAccount,
    createDoctorAccount
} = require("../controllers/authController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

// Login route
router.post("/login", loginUser);

// Create Patient Account - Admin only
router.post(
    "/create-patient",
    protect,
    authorizeRoles("admin"),
    createPatientAccount
);

// Create Doctor Account - Admin only
router.post(
    "/create-doctor",
    protect,
    authorizeRoles("admin"),
    createDoctorAccount
);

module.exports = router;
