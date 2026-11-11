
const Hospital = require("../models/Hospital");

// CREATE HOSPITAL
const createHospital = async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);

        res.status(201).json({
            success: true,
            message: "Hospital created successfully",
            data: hospital
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL HOSPITALS
const getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();

        res.status(200).json({
            success: true,
            count: hospitals.length,
            data: hospitals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE HOSPITAL
const getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            success: true,
            data: hospital
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE HOSPITAL
const updateHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Hospital updated successfully",
            data: hospital
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE HOSPITAL
const deleteHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Hospital deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createHospital,
    getHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital
};
