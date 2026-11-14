const express = require("express");
const router = express.Router();

const {
    loginUser,
    createPatientAccount
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

module.exports = router;