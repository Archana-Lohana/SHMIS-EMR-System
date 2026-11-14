
const express = require("express");

const router = express.Router();

const {
    createHospital,
    getHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital
} = require("../controllers/hospitalController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin only
router.post("/", protect, authorizeRoles("admin"), createHospital);

// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getHospitals);

// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getHospitalById);

// UPDATE - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateHospital);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteHospital);

module.exports = router;
