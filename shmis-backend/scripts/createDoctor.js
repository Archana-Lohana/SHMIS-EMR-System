require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createDoctor = async () => {
    try {
        if (
            !process.env.DOCTOR_NAME ||
            !process.env.DOCTOR_USERNAME ||
            !process.env.DOCTOR_PASSWORD ||
            !process.env.MONGO_URI
        ) {
            throw new Error("Required environment variables are missing.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        const existingDoctor = await User.findOne({
            username: process.env.DOCTOR_USERNAME.toLowerCase().trim()
        });

        if (existingDoctor) {
            console.log("A user with this username already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.DOCTOR_PASSWORD,
            10
        );

        await User.create({
            name: process.env.DOCTOR_NAME,
            username: process.env.DOCTOR_USERNAME,
            password: hashedPassword,
            role: "doctor"
        });

        console.log("Doctor account created successfully!");

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createDoctor();