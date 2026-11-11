const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema(
    {
        testCode: {
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
        testName: {
            type: String,
            required: true,
            trim: true
        },
        testCategory: {
            type: String,
            required: true
        },
        testDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        result: {
            type: String
        },
        normalRange: {
            type: String
        },
        remarks: {
            type: String
        },
        reportStatus: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("LabTest", labTestSchema);