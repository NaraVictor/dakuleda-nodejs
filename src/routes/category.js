const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const category = require("../controller/category");

// routes

// GET
router.get("/api/categories", category.getCategories);
router.get("/api/categories/:slug", category.getCategoryBySlug);

// POST / PUT
router.put("/api/categories", authenticateToken, category.updateCategory);
router.post("/api/categories", authenticateToken, category.newCategory);
router.post(
	"/api/categories/:id/upload-picture",
	authenticateToken,
	category.uploadPicture
);

// DELETE
router.delete(
	"/api/categories/:id",
	authenticateToken,
	category.deleteCategory
);

module.exports = router;
