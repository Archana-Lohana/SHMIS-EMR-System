
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        departmentCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String
        },

        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
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

module.exports = mongoose.model("Department", departmentSchema);
