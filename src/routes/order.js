const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const order = require("../controller/order");

// routes

// GET
router.get("/api/orders", order.getOrders);
router.get("/api/orders/:orderId", order.getOrderById);
// router.get("/api/orders/:orderId/refund", order.getProductById);

// POST / PUT
router.post("/api/orders", order.newOrder);
router.put(
	"/api/orders/:orderId/approve",
	authenticateToken,
	order.approveOrder
);
// router.post("/api/orders/:orderId/refund", order.newProduct);

// DELETE
router.delete("/api/orders/:orderId", authenticateToken, order.deleteOrder);
// router.delete("/api/orders/:orderId/refund/:refundId", order.deleteProduct);

module.exports = router;
