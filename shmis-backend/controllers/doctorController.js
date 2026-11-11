
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Department = require("../models/Department");

// CREATE DOCTOR
const createDoctor = async (req, res) => {
    try {
        const { hospital, department } = req.body;

        const hospitalExists = await Hospital.findById(hospital);
        if (!hospitalExists) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        const departmentExists = await Department.findById(department);
        if (!departmentExists) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        if (departmentExists.hospital.toString() !== hospital) {
            return res.status(400).json({
                success: false,
                message: "Department does not belong to this hospital"
            });
        }

        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            data: doctor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL DOCTORS
const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate("hospital", "name hospitalCode")
            .populate("department", "name departmentCode");

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET DOCTOR BY ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate("hospital", "name hospitalCode")
            .populate("department", "name departmentCode");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            data: doctor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};
