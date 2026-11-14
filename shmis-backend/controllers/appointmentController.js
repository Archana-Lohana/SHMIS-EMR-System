
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

// CREATE APPOINTMENT
const createAppointment = async (req, res) => {
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

        const appointment = await Appointment.create(req.body);

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// GET MY APPOINTMENTS - Patient only
const getMyAppointments = async (req, res) => {
    try {
        if (!req.user.patient) {
            return res.status(404).json({
                success: false,
                message: "No patient profile linked to this account."
            });
        }

        console.log("LOGIN PATIENT ID:", req.user.patient);

        console.log(
            "MY APPOINTMENTS:",
            await Appointment.find({ patient: req.user.patient })
        );

        const appointments = await Appointment.find({
            patient: req.user.patient
        })

        
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL APPOINTMENTS
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET APPOINTMENT BY ID
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate("patient", "name patientCode contactNumber")
            .populate("doctor", "name doctorCode specialization")
            .populate("hospital", "name hospitalCode");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE APPOINTMENT
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE APPOINTMENT
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(
            req.params.id
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    getMyAppointments,
    updateAppointment,
    deleteAppointment
};