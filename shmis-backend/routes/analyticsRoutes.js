
const express = require("express");
const router = express.Router();

const {
    getDoctorsBySpecialization,
    getDoctorsByHospital,
    getDepartmentsByHospital,
    getPatientsByGender,
    getPatientsByBloodGroup,
    searchDoctors
} = require("../controllers/analyticsController");

router.get("/doctors-by-specialization", getDoctorsBySpecialization);

router.get("/doctors-by-hospital", getDoctorsByHospital);

router.get("/departments-by-hospital", getDepartmentsByHospital);

router.get("/patients-by-gender", getPatientsByGender);

router.get("/patients-by-blood-group", getPatientsByBloodGroup);

router.get("/search-doctors", searchDoctors);

module.exports = router;
