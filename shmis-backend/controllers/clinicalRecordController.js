const ClinicalRecord = require("../models/ClinicalRecord");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Appointment = require("../models/Appointment");
// Check whether a patient is assigned to this doctor
const isPatientAssigned = async (doctorId, patientId) => {
    const appointment = await Appointment.findOne({
        doctor: doctorId,
        patient: patientId
    });

    return !!appointment;
};
// CREATE Clinical Record
// CREATE Clinical Record
const createClinicalRecord = async (req, res) => {
    try {
        const {
            recordCode,
            patient,
            doctor,
            hospital,
            visitDate,
            symptoms,
            diagnosis,
            treatmentPlan,
            clinicalNotes,
            vitals,
            followUpDate,
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

        // Doctor can only create records for assigned patients
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
                    message: "You can only create records for your assigned patients."
                });
            }

            // Use the logged-in doctor's own ID
            doctorId = req.user.doctor;
        }

        const doctorExists = await Doctor.findById(doctorId);

        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Doctor must use their own hospital
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

        const clinicalRecord = await ClinicalRecord.create({
            recordCode,
            patient,
            doctor: doctorId,
            hospital: hospitalId,
            visitDate,
            symptoms,
            diagnosis,
            treatmentPlan,
            clinicalNotes,
            vitals,
            followUpDate,
            status
        });

        res.status(201).json({
            success: true,
            message: "Clinical record created successfully",
            data: clinicalRecord
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// GET MY CLINICAL RECORDS - Patient only
const getMyClinicalRecords = async (req, res) => {
    try {
        if (!req.user.patient) {
            return res.status(404).json({
                success: false,
                message: "No patient profile linked to this account."
            });
        }

        const records = await ClinicalRecord.find({
            patient: req.user.patient
        })
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL Clinical Records

// GET ALL Clinical Records
const getClinicalRecords = async (req, res) => {
    try {
        let filter = {};

        // Doctor can only see records of assigned patients
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

        // Admin can see all clinical records
        const records = await ClinicalRecord.find(filter)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET Clinical Record BY ID

// GET Clinical Record BY ID
const getClinicalRecordById = async (req, res) => {
    try {
        let filter = { _id: req.params.id };

        // Doctor can only access records of assigned patients
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

        const record = await ClinicalRecord.findOne(filter)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Clinical record not found or you do not have permission to view it."
            });
        }

        res.status(200).json({
            success: true,
            data: record
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE Clinical Record
// UPDATE Clinical Record
const updateClinicalRecord = async (req, res) => {
    try {
        const record = await ClinicalRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Clinical record not found"
            });
        }

        let updateData = req.body;

        // Doctor can only update records of assigned patients
        if (req.user.role === "doctor") {

            if (!req.user.doctor) {
                return res.status(404).json({
                    success: false,
                    message: "No doctor profile linked to this account."
                });
            }

            const assigned = await isPatientAssigned(
                req.user.doctor,
                record.patient
            );

            if (!assigned) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot update this patient's clinical record."
                });
            }

            // Doctor can update medical details only
            const allowedFields = [
                "visitDate",
                "symptoms",
                "diagnosis",
                "treatmentPlan",
                "clinicalNotes",
                "vitals",
                "followUpDate",
                "status"
            ];

            updateData = {};

            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                }
            });
        }

        const updatedRecord = await ClinicalRecord.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Clinical record updated successfully",
            data: updatedRecord
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE Clinical Record
const deleteClinicalRecord = async (req, res) => {
    try {
        const record = await ClinicalRecord.findByIdAndDelete(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Clinical record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Clinical record deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createClinicalRecord,
    getClinicalRecords,
    getClinicalRecordById,
    getMyClinicalRecords,
    updateClinicalRecord,
    deleteClinicalRecord
};