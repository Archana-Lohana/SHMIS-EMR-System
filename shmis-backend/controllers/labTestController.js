const LabTest = require("../models/LabTest");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

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

// GET ALL
const getLabTests = async (req, res) => {
    try {
        const tests = await LabTest.find()
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
        const test = await LabTest.findById(req.params.id)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
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
    updateLabTest,
    deleteLabTest
};