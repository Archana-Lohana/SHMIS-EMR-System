
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        appointmentCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true
        },
        appointmentDate: {
            type: Date,
            required: true
        },
        appointmentTime: {
            type: String,
            required: true
        },
        appointmentType: {
            type: String,
            enum: ["Consultation", "Follow-up", "Emergency"],
            default: "Consultation"
        },
        reason: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
