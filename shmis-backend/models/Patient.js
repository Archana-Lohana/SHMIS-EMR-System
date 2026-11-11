
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        patientCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },
        contactNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        address: {
            type: String,
            required: true
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        },
        emergencyContact: {
            name: String,
            contactNumber: String,
            relationship: String
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
