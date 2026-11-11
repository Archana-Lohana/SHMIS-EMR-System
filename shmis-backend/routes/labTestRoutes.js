const express = require("express");
const router = express.Router();

const {
    createLabTest,
    getLabTests,
    getLabTestById,
    updateLabTest,
    deleteLabTest
} = require("../controllers/labTestController");

router.post("/", createLabTest);
router.get("/", getLabTests);
router.get("/:id", getLabTestById);
router.put("/:id", updateLabTest);
router.delete("/:id", deleteLabTest);

module.exports = router;