const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        medicineName: {
            type: String,
            required: true,
            trim: true
        },
        dosage: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        instructions: {
            type: String
        }
    },
    { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
    {
        prescriptionCode: {
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
        prescriptionDate: {
            type: Date,
            default: Date.now
        },
        medicines: {
            type: [medicineSchema],
            required: true,
            validate: {
                validator: value => value.length > 0,
                message: "At least one medicine is required"
            }
        },
        notes: {
            type: String
        },
        status: {
            type: String,
            enum: ["Active", "Completed", "Cancelled"],
            default: "Active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);