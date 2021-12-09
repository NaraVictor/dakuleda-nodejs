const express = require("express");
const router = express.Router();

const slider = require("../controller/slider");

// routes

// GET
router.get("/api/sliders", slider.getSliders);
router.get("/api/sliders/:id", slider.getSliderById);

// POST / PUT
router.put("/api/sliders/:id", slider.updateSlider);
router.post("/api/sliders", slider.newSlider);

// DELETE
router.delete("/api/sliders/:id", slider.deleteSlider);

module.exports = router;
