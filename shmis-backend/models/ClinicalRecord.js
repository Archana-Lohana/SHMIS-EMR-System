const mongoose = require("mongoose");

const clinicalRecordSchema = new mongoose.Schema(
    {
        recordCode: {
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

        visitDate: {
            type: Date,
            required: true,
            default: Date.now
        },

        symptoms: {
            type: [String],
            required: true
        },

        diagnosis: {
            type: String,
            required: true,
            trim: true
        },

        treatmentPlan: {
            type: String,
            required: true
        },

        clinicalNotes: {
            type: String
        },

        vitals: {
            bloodPressure: String,
            temperature: Number,
            heartRate: Number,
            respiratoryRate: Number,
            oxygenLevel: Number,
            weight: Number
        },

        followUpDate: {
            type: Date
        },

        status: {
            type: String,
            enum: ["Open", "Under Treatment", "Completed"],
            default: "Open"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ClinicalRecord", clinicalRecordSchema);