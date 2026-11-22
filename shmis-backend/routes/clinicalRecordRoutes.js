
const express = require("express");
const router = express.Router();

const {
    createClinicalRecord,
    getClinicalRecords,
    getClinicalRecordById,
    getMyClinicalRecords,
    updateClinicalRecord,
    deleteClinicalRecord
} = require("../controllers/clinicalRecordController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin and Doctor
router.post("/", protect, authorizeRoles("admin", "doctor"), createClinicalRecord);

// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getClinicalRecords);

// READ OWN RECORDS - Patient only
router.get("/my", protect, authorizeRoles("patient"), getMyClinicalRecords);

// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getClinicalRecordById);

// UPDATE - Admin and Doctor
router.put("/:id", protect, authorizeRoles("admin", "doctor"), updateClinicalRecord);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteClinicalRecord);

module.exports = router;
