
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const hospitalRoutes = require("./routes/hospitalRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const clinicalRecordRoutes = require("./routes/clinicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const labTestRoutes = require("./routes/labTestRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("SHMIS Backend API is Running Successfully!");
});

// Hospital Routes
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clinical-records", clinicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/lab-tests", labTestRoutes);
app.use("/api/analytics", analyticsRoutes);

// Server
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
