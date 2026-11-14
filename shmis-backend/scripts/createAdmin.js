
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        if (
            !process.env.ADMIN_NAME ||
            !process.env.ADMIN_USERNAME ||
            !process.env.ADMIN_PASSWORD ||
            !process.env.MONGO_URI
        ) {
            throw new Error("Required environment variables are missing.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            role: "admin"
        });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        await User.create({
            name: process.env.ADMIN_NAME,
            username: process.env.ADMIN_USERNAME,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin account created successfully!");

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createAdmin();
