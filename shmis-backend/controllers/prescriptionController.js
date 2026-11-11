const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

// CREATE
const createPrescription = async (req, res) => {
    try {
        const { patient, doctor, hospital } = req.body;

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

        const prescription = await Prescription.create(req.body);

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

// GET ALL
const getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find()
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
const getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found"
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
const updatePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Prescription updated successfully",
            data: prescription
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
    updatePrescription,
    deletePrescription
};