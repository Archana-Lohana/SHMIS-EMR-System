
const Department = require("../models/Department");
const Hospital = require("../models/Hospital");

// CREATE DEPARTMENT
const createDepartment = async (req, res) => {
    try {
        const { hospital } = req.body;

        const hospitalExists = await Hospital.findById(hospital);

        if (!hospitalExists) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        const department = await Department.create(req.body);

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL DEPARTMENTS
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE DEPARTMENT
const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id)
            .populate("hospital", "name hospitalCode");

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE DEPARTMENT
const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE DEPARTMENT
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
