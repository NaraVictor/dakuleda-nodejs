const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const coupon = require("../controller/coupon");

// routes

// GET
router.get("/api/coupons", coupon.getCoupons); //accepts query params -> include_orders = true/false
router.get("/api/coupons/:id", coupon.getCouponById);

// POST / PUT
router.put("/api/coupons", authenticateToken, coupon.updateCoupon);
router.post("/api/coupons/:id/codes", authenticateToken, coupon.addCouponCodes);
router.post("/api/coupons", authenticateToken, coupon.newCoupon);

// DELETE
router.delete("/api/coupons/:id", authenticateToken, coupon.deleteCoupon);

module.exports = router;
