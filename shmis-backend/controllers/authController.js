
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// ==============================
// USER LOGIN
// ==============================
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter username and password."
            });
        }

        const user = await User.findOne({
            username: username.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                linkId: user.role === "patient"
                    ? user.patient?.toString() || null
                    : user.role === "doctor"
                    ? user.doctor?.toString() || null
                    : null
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==============================
// CREATE PATIENT LOGIN ACCOUNT
// Admin only
// ==============================
const createPatientAccount = async (req, res) => {
    try {
        const { patientId, username, password } = req.body;

        if (!patientId || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Patient ID, username and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        const normalizedUsername = username.toLowerCase().trim();

        const existingUser = await User.findOne({
            username: normalizedUsername
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username already exists."
            });
        }

        const existingPatientAccount = await User.findOne({
            patient: patient._id
        });

        if (existingPatientAccount) {
            return res.status(409).json({
                success: false,
                message: "This patient already has a login account."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: patient.name,
            username: normalizedUsername,
            password: hashedPassword,
            role: "patient",
            patient: patient._id
        });

        res.status(201).json({
            success: true,
            message: "Patient login account created successfully.",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                linkId: user.patient.toString()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==============================
// CREATE DOCTOR LOGIN ACCOUNT
// Admin only
// ==============================
const createDoctorAccount = async (req, res) => {
    try {
        const { doctorId, username, password } = req.body;

        if (!doctorId || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID, username and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        // Find Doctor profile
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        // Check username
        const normalizedUsername = username.toLowerCase().trim();

        const existingUser = await User.findOne({
            username: normalizedUsername
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username already exists."
            });
        }

        // Check existing Doctor account
        const existingDoctorAccount = await User.findOne({
            doctor: doctor._id
        });

        if (existingDoctorAccount) {
            return res.status(409).json({
                success: false,
                message: "This doctor already has a login account."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create linked Doctor account
        const user = await User.create({
            name: doctor.name,
            username: normalizedUsername,
            password: hashedPassword,
            role: "doctor",
            doctor: doctor._id
        });

        res.status(201).json({
            success: true,
            message: "Doctor login account created successfully.",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                linkId: user.doctor.toString()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==============================
// EXPORT FUNCTIONS
// ==============================
module.exports = {
    loginUser,
    createPatientAccount,
    createDoctorAccount
};
