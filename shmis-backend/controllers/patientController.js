
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

// CREATE PATIENT
const createPatient = async (req, res) => {
    try {
        const patient = await Patient.create(req.body);

        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            data: patient
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL PATIENTS
const getPatients = async (req, res) => {
    try {
        let filter = {};

        // Doctor can only see assigned patients
        if (req.user.role === "doctor") {

            if (!req.user.doctor) {
                return res.status(404).json({
                    success: false,
                    message: "No doctor profile linked to this account."
                });
            }

            const patientIds = await Appointment.distinct(
                "patient",
                { doctor: req.user.doctor }
            );

            filter._id = { $in: patientIds };
        }

        const patients = await Patient.find(filter);

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET LOGGED-IN PATIENT PROFILE
const getMyPatientProfile = async (req, res) => {
    try {
        if (!req.user.patient) {
            return res.status(404).json({
                success: false,
                message: "No patient profile linked to this account."
            });
        }

        const patient = await Patient.findById(req.user.patient);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient profile not found."
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET PATIENT BY ID
const getPatientById = async (req, res) => {
    try {
        let filter = { _id: req.params.id };

        // Doctor can only access assigned patients
        if (req.user.role === "doctor") {

            if (!req.user.doctor) {
                return res.status(404).json({
                    success: false,
                    message: "No doctor profile linked to this account."
                });
            }

            const patientIds = await Appointment.distinct(
                "patient",
                { doctor: req.user.doctor }
            );

            filter._id = {
                $in: patientIds,
                $eq: req.params.id
            };
        }

        const patient = await Patient.findOne(filter);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found or you do not have access."
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PATIENT
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Patient updated successfully",
            data: patient
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PATIENT
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Patient deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    getMyPatientProfile,
    updatePatient,
    deletePatient
};
