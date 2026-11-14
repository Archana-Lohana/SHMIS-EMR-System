
const express = require("express");
const router = express.Router();

const {
    createLabTest,
    getLabTests,
    getLabTestById,
    getMyLabTests,
    updateLabTest,
    deleteLabTest
} = require("../controllers/labTestController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin only
router.post("/", protect, authorizeRoles("admin"), createLabTest);

// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getLabTests);
// READ OWN LAB TESTS - Patient only
router.get("/my", protect, authorizeRoles("patient"), getMyLabTests);

// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getLabTestById);

// UPDATE - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateLabTest);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteLabTest);

module.exports = router;
