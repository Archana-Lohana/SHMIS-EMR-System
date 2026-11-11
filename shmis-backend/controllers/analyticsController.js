
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Patient = require("../models/Patient");

// 1. Doctors by Specialization
const getDoctorsBySpecialization = async (req, res) => {
    try {
        const result = await Doctor.aggregate([
            {
                $group: {
                    _id: "$specialization",
                    totalDoctors: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Doctors by Hospital
const getDoctorsByHospital = async (req, res) => {
    try {
        const result = await Doctor.aggregate([
            {
                $lookup: {
                    from: "hospitals",
                    localField: "hospital",
                    foreignField: "_id",
                    as: "hospitalDetails"
                }
            },
            { $unwind: "$hospitalDetails" },
            {
                $group: {
                    _id: "$hospitalDetails.name",
                    totalDoctors: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Departments by Hospital
const getDepartmentsByHospital = async (req, res) => {
    try {
        const result = await Department.aggregate([
            {
                $lookup: {
                    from: "hospitals",
                    localField: "hospital",
                    foreignField: "_id",
                    as: "hospitalDetails"
                }
            },
            { $unwind: "$hospitalDetails" },
            {
                $group: {
                    _id: "$hospitalDetails.name",
                    totalDepartments: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Patients by Gender
const getPatientsByGender = async (req, res) => {
    try {
        const result = await Patient.aggregate([
            {
                $group: {
                    _id: "$gender",
                    totalPatients: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Patients by Blood Group
const getPatientsByBloodGroup = async (req, res) => {
    try {
        const result = await Patient.aggregate([
            {
                $group: {
                    _id: "$bloodGroup",
                    totalPatients: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Doctor Text Search
const searchDoctors = async (req, res) => {
    try {
        const searchTerm = req.query.q;

        if (!searchTerm || !searchTerm.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a search term using ?q="
            });
        }

        const result = await Doctor.find(
            { $text: { $search: searchTerm } },
            {
                score: { $meta: "textScore" },
                name: 1,
                specialization: 1,
                doctorCode: 1
            }
        ).sort({ score: { $meta: "textScore" } });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDoctorsBySpecialization,
    getDoctorsByHospital,
    getDepartmentsByHospital,
    getPatientsByGender,
    getPatientsByBloodGroup,
    searchDoctors
};
