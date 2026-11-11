
const express = require("express");

const router = express.Router();

const {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

// CREATE
router.post("/", createDepartment);

// READ ALL
router.get("/", getDepartments);

// READ SINGLE
router.get("/:id", getDepartmentById);

// UPDATE
router.put("/:id", updateDepartment);

// DELETE
router.delete("/:id", deleteDepartment);

module.exports = router;
