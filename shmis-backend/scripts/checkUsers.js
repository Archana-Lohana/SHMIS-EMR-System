

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const users = await User.find().select("name username role");

        console.log("Existing Users:");

        console.table(
            users.map(user => ({
                name: user.name,
                username: user.username,
                role: user.role
            }))
        );

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

checkUsers();
