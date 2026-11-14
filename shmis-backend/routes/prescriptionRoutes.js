const express = require("express");
const router = express.Router();

const {
    createPrescription,
    getPrescriptions,
    getPrescriptionById,
    getMyPrescriptions,
    updatePrescription,
    deletePrescription
} = require("../controllers/prescriptionController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin only
router.post("/", protect, authorizeRoles("admin"), createPrescription);

// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getPrescriptions);

// READ OWN PRESCRIPTIONS - Patient only
router.get("/my", protect, authorizeRoles("patient"), getMyPrescriptions);

// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getPrescriptionById);

// UPDATE - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updatePrescription);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deletePrescription);

module.exports = router;