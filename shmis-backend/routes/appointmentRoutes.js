
const express = require("express");
const router = express.Router();

const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    getMyAppointments,
    updateAppointment,
    deleteAppointment
} = require("../controllers/appointmentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin only
router.post("/", protect, authorizeRoles("admin"), createAppointment);


// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getAppointments);

// READ OWN APPOINTMENTS - Patient only
router.get("/my", protect, authorizeRoles("patient"), getMyAppointments);

// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getAppointmentById);

// UPDATE - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateAppointment);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteAppointment);

module.exports = router;
