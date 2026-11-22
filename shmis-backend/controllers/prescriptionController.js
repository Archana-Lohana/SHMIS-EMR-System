const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Appointment = require("../models/Appointment");
// Check whether patient is assigned to doctor
const isPatientAssigned = async (doctorId, patientId) => {
    const appointment = await Appointment.findOne({
        doctor: doctorId,
        patient: patientId
    });

    return !!appointment;
};
// CREATE
// CREATE PRESCRIPTION
const createPrescription = async (req, res) => {
    try {
        const {
            prescriptionCode,
            patient,
            doctor,
            hospital,
            prescriptionDate,
            medicines,
            notes,
            status
        } = req.body;

        const patientExists = await Patient.findById(patient);

        if (!patientExists) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        let doctorId = doctor;
        let hospitalId = hospital;

        // Doctor login security
        if (req.user.role === "doctor") {

            if (!req.user.doctor) {
                return res.status(404).json({
                    success: false,
                    message: "No doctor profile linked to this account."
                });
            }

            const assigned = await isPatientAssigned(
                req.user.doctor,
                patient
            );

            if (!assigned) {
                return res.status(403).json({
                    success: false,
                    message: "You can only create prescriptions for your assigned patients."
                });
            }

            doctorId = req.user.doctor;
        }

        const doctorExists = await Doctor.findById(doctorId);

        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Doctor's hospital will be selected automatically
        if (req.user.role === "doctor") {
            hospitalId = doctorExists.hospital;
        }

        const hospitalExists = await Hospital.findById(hospitalId);

        if (!hospitalExists) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        if (doctorExists.hospital.toString() !== hospitalId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Doctor does not belong to this hospital"
            });
        }

        const prescription = await Prescription.create({
            prescriptionCode,
            patient,
            doctor: doctorId,
            hospital: hospitalId,
            prescriptionDate,
            medicines,
            notes,
            status
        });

        res.status(201).json({
            success: true,
            message: "Prescription created successfully",
            data: prescription
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// GET MY PRESCRIPTIONS - Patient only
const getMyPrescriptions = async (req, res) => {
    try {
        if (!req.user.patient) {
            return res.status(404).json({
                success: false,
                message: "No patient profile linked to this account."
            });
        }

        const prescriptions = await Prescription.find({
            patient: req.user.patient
        })
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// GET ALL

// GET ALL
const getPrescriptions = async (req, res) => {
    try {
        let filter = {};

        // Doctor can only see prescriptions of assigned patients
        if (req.user.role === "doctor") {

            if (!req.user.doctor) {
                return res.status(404).json({
                    success: false,
                    message: "No doctor profile linked to this account."
                });
            }

            const patientIds = await Appointment.distinct("patient", {
                doctor: req.user.doctor
            });

            filter.patient = { $in: patientIds };
        }

        // Admin can see all prescriptions
        const prescriptions = await Prescription.find(filter)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET BY ID

// GET BY ID
const getPrescriptionById = async (req, res) => {
    try {
        let filter = { _id: req.params.id };

        // Doctor can only access prescriptions of assigned patients
        if (req.user.role === "doctor") {

            if (!req.user.doctor) {
                return res.status(404).json({
                    success: false,
                    message: "No doctor profile linked to this account."
                });
            }

            const patientIds = await Appointment.distinct("patient", {
                doctor: req.user.doctor
            });

            filter.patient = { $in: patientIds };
        }

        const prescription = await Prescription.findOne(filter)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found or you do not have permission to view it."
            });
        }

        res.status(200).json({
            success: true,
            data: prescription
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE
// UPDATE PRESCRIPTION
const updatePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found"
            });
        }

        let updateData = req.body;

        // Doctor security
        if (req.user.role === "doctor") {

            if (!req.user.doctor) {
                return res.status(404).json({
                    success: false,
                    message: "No doctor profile linked to this account."
                });
            }

            const assigned = await isPatientAssigned(
                req.user.doctor,
                prescription.patient
            );

            if (!assigned) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot update this patient's prescription."
                });
            }

            // Doctor cannot change patient, doctor, hospital or prescription code
            const allowedFields = [
                "prescriptionDate",
                "medicines",
                "notes",
                "status"
            ];

            updateData = {};

            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                }
            });
        }

        const updatedPrescription = await Prescription.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Prescription updated successfully",
            data: updatedPrescription
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE
const deletePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndDelete(
            req.params.id
        );

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Prescription deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPrescription,
    getPrescriptions,
    getPrescriptionById,
    getMyPrescriptions,
    updatePrescription,
    deletePrescription
};