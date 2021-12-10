const express = require("express");
const router = express.Router();

const product = require("../controller/product");
const authenticateToken = require("../middleware/auth");

// routes

// basic crud routes
// GET
router.get("/api/products/:slug", product.getProductBySlug);
router.get("/api/products", product.getProducts);
// router.get("/api/products/price-schedules", product.getProducts);
// router.get("/api/products/:productId/price-schedules", product.getProducts);
router.get("/api/products/:productId/features", product.getFeatures);
router.get("/api/products/:productId/gallery", product.getGallery);
router.get("/api/products/:productId/reviews", product.getReviews);
router.get("/api/products/:productId/tags", product.getTags);

// POST / PUT
router.put("/api/products", product.updateProduct); // update
router.post("/api/products", authenticateToken, product.newProduct);
router.post(
	"/api/products/:productId/upload-picture",
	authenticateToken,
	product.uploadPicture
);
router.post(
	"/api/products/:productId/features",
	authenticateToken,
	product.newFeature
);
router.post(
	"/api/products/:productId/gallery",
	authenticateToken,
	product.newGallery
);
router.post("/api/products/:productId/reviews", product.newReview);
router.post("/api/products/:productId/tags", product.newTag);
// router.post("/api/products/:productId/price-schedules", product.getProducts);

// DELETE
router.delete(
	"/api/products/:productId",
	authenticateToken,
	product.deleteProduct
);
router.delete(
	"/api/products/:productId/features/:featureId",
	authenticateToken,
	product.deleteFeature
);
router.delete(
	"/api/products/:productId/gallery/:galleryId",
	authenticateToken,
	product.deleteGallery
);
router.delete(
	"/api/products/:productId/reviews/:reviewId",
	authenticateToken,
	product.deleteReview
);
router.delete("/api/products/:productId/tags/:tagId", product.deleteTag);

// router.delete(
// 	"/api/products/:productId/price-schedules/:priceId",
// 	product.deleteProduct
// );

module.exports = router;
