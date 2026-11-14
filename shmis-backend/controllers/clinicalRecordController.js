const ClinicalRecord = require("../models/ClinicalRecord");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

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

        const doctorExists = await Doctor.findById(doctor);
        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const hospitalExists = await Hospital.findById(hospital);
        if (!hospitalExists) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        if (doctorExists.hospital.toString() !== hospital) {
            return res.status(400).json({
                success: false,
                message: "Doctor does not belong to this hospital"
            });
        }

        const clinicalRecord = await ClinicalRecord.create({
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
const getClinicalRecords = async (req, res) => {
    try {
        const records = await ClinicalRecord.find()
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
const getClinicalRecordById = async (req, res) => {
    try {
        const record = await ClinicalRecord.findById(req.params.id)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Clinical record not found"
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
const updateClinicalRecord = async (req, res) => {
    try {
        const record = await ClinicalRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Clinical record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Clinical record updated successfully",
            data: record
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