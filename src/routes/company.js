const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const company = require("../controller/company");

// routes

// GET
router.get("/api/company", authenticateToken, company.getCompany);

// POST / PUT
router.put("/api/company/:id", authenticateToken, company.updateCompany);
router.post("/api/company", authenticateToken, company.createProfile);

// DELETE
// router.delete("/api/company/:id", company.deleteCompany);

module.exports = router;
