
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        doctorCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        specialization: {
            type: String,
            required: true
        },
        qualification: {
            type: String,
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
        experienceYears: {
            type: Number,
            default: 0,
            min: 0
        },
        consultationFee: {
            type: Number,
            required: true,
            min: 0
        },
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
