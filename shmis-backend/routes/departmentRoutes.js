
const express = require("express");

const router = express.Router();

const {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE - Admin only
router.post("/", protect, authorizeRoles("admin"), createDepartment);

// READ ALL - Admin and Doctor
router.get("/", protect, authorizeRoles("admin", "doctor"), getDepartments);

// READ SINGLE - Admin and Doctor
router.get("/:id", protect, authorizeRoles("admin", "doctor"), getDepartmentById);

// UPDATE - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateDepartment);

// DELETE - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteDepartment);

module.exports = router;
