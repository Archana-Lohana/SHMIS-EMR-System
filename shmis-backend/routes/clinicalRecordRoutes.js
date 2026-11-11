const express = require("express");
const router = express.Router();

const {
    createClinicalRecord,
    getClinicalRecords,
    getClinicalRecordById,
    updateClinicalRecord,
    deleteClinicalRecord
} = require("../controllers/clinicalRecordController");

router.post("/", createClinicalRecord);

router.get("/", getClinicalRecords);

router.get("/:id", getClinicalRecordById);

router.put("/:id", updateClinicalRecord);

router.delete("/:id", deleteClinicalRecord);

module.exports = router;