const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const manu = require("../controller/manufacturer");

// routes

// GET
router.get("/api/manufacturers", manu.getManufacturers);
router.get("/api/manufacturers/:id", manu.getManufacturerById);

// POST / PUT
router.put("/api/manufacturers", authenticateToken, manu.updateManufacturer);
router.post("/api/manufacturers", authenticateToken, manu.newManufacturer);

// DELETE
router.delete(
	"/api/manufacturers/:id",
	authenticateToken,
	manu.deleteManufacturer
);

module.exports = router;
