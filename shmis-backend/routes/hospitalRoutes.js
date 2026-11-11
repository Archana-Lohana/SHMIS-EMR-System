
const express = require("express");

const router = express.Router();

const {
    createHospital,
    getHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital
} = require("../controllers/hospitalController");

// CREATE
router.post("/", createHospital);

// READ ALL
router.get("/", getHospitals);

// READ SINGLE
router.get("/:id", getHospitalById);

// UPDATE
router.put("/:id", updateHospital);

// DELETE
router.delete("/:id", deleteHospital);

module.exports = router;
