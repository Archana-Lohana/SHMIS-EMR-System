
const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        hospitalCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        district: {
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

        hospitalType: {
            type: String,
            enum: ["Government", "Private"],
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
