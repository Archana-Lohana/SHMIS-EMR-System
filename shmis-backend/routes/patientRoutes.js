
const express = require("express");
const router = express.Router();

const {
    createPatient,
    getPatients,
    getPatientById,
    getMyPatientProfile,
    updatePatient,
    deletePatient
} = require("../controllers/patientController");


const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin only
router.post("/", protect, authorizeRoles("admin"), createPatient);

// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getPatients);
// READ OWN PROFILE - Patient only
router.get("/me", protect, authorizeRoles("patient"), getMyPatientProfile);
// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getPatientById);

// UPDATE - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updatePatient);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deletePatient);

module.exports = router;
