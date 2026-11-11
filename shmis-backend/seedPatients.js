
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Patient = require("./models/Patient");

const genders = ["Male", "Female"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const firstNames = [
    "Ahmed", "Ali", "Fatima", "Ayesha", "Hassan",
    "Zain", "Sara", "Maryam", "Usman", "Hina",
    "Bilal", "Sana", "Hamza", "Zara", "Umar"
];

const lastNames = [
    "Khan", "Ali", "Lohana", "Memon", "Shah",
    "Soomro", "Qureshi", "Chandio", "Junejo", "Rajput"
];

const cities = [
    "Hyderabad", "Karachi", "Sukkur", "Larkana",
    "Mirpurkhas", "Nawabshah", "Mithi", "Umerkot"
];

const seedPatients = async () => {
    try {
        await connectDB();

        const operations = [];

        for (let i = 1; i <= 1000; i++) {
            const patientCode = `SEED${String(i).padStart(4, "0")}`;

            const patient = {
                patientCode,
                name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
                dateOfBirth: new Date(
                    1980 + (i % 30),
                    i % 12,
                    (i % 28) + 1
                ),
                gender: genders[i % genders.length],
                contactNumber: `0300${String(i).padStart(7, "0")}`,
                email: `seedpatient${i}@example.com`,
                address: `${cities[i % cities.length]}, Sindh, Pakistan`,
                bloodGroup: bloodGroups[i % bloodGroups.length],
                status: "Active"
            };

            operations.push({
                updateOne: {
                    filter: { patientCode },
                    update: { $setOnInsert: patient },
                    upsert: true
                }
            });
        }

        const result = await Patient.bulkWrite(operations);

        console.log("Patient sample data generation completed!");
        console.log("New records inserted:", result.upsertedCount);
        console.log("Existing records matched:", result.matchedCount);
        console.log("Total patients now:", await Patient.countDocuments());

    } catch (error) {
        console.error("Seeding failed:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

seedPatients();
