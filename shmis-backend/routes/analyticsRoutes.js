
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

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Analytics - Admin and Doctor
router.get(
    "/doctors-by-specialization",
    protect,
    authorizeRoles("admin", "doctor"),
    getDoctorsBySpecialization
);

router.get(
    "/doctors-by-hospital",
    protect,
    authorizeRoles("admin", "doctor"),
    getDoctorsByHospital
);

router.get(
    "/departments-by-hospital",
    protect,
    authorizeRoles("admin", "doctor"),
    getDepartmentsByHospital
);

router.get(
    "/patients-by-gender",
    protect,
    authorizeRoles("admin", "doctor"),
    getPatientsByGender
);

router.get(
    "/patients-by-blood-group",
    protect,
    authorizeRoles("admin", "doctor"),
    getPatientsByBloodGroup
);

router.get(
    "/search-doctors",
    protect,
    authorizeRoles("admin", "doctor"),
    searchDoctors
);

module.exports = router;
