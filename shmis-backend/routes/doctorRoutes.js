
const express = require("express");
const router = express.Router();

const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} = require("../controllers/doctorController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin only
router.post("/", protect, authorizeRoles("admin"), createDoctor);

// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getDoctors);

// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getDoctorById);

// UPDATE - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateDoctor);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteDoctor);

module.exports = router;
