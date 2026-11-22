const LabTest = require("../models/LabTest");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Appointment = require("../models/Appointment");

// CREATE
const createLabTest = async (req, res) => {
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

        const labTest = await LabTest.create(req.body);

        res.status(201).json({
            success: true,
            message: "Lab test created successfully",
            data: labTest
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// GET MY LAB TESTS - Patient only
const getMyLabTests = async (req, res) => {
    try {
        if (!req.user.patient) {
            return res.status(404).json({
                success: false,
                message: "No patient profile linked to this account."
            });
        }

        const tests = await LabTest.find({
            patient: req.user.patient
        })
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// GET ALL
const getLabTests = async (req, res) => {
    try {
        let filter = {};

        // Doctor can only see lab tests of assigned patients
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

        // Admin can see all lab tests
        const tests = await LabTest.find(filter)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET BY ID
const getLabTestById = async (req, res) => {
    try {
        let filter = { _id: req.params.id };

        // Doctor can only access lab tests of assigned patients
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

        const test = await LabTest.findOne(filter)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found or you do not have permission to view it."
            });
        }

        res.status(200).json({
            success: true,
            data: test
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE
const updateLabTest = async (req, res) => {
    try {
        const test = await LabTest.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lab test updated successfully",
            data: test
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE
const deleteLabTest = async (req, res) => {
    try {
        const test = await LabTest.findByIdAndDelete(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lab test deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createLabTest,
    getLabTests,
    getLabTestById,
    getMyLabTests,
    updateLabTest,
    deleteLabTest
};