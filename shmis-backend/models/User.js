const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },
       role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    required: true
},

patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);