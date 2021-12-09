const router = require("express").Router();

// Users routes

router.all("/", async (req, res) => {
	res.send({
		message: "Welcome to Dakuleda.com API Endpoint",
	});
});
router.use(require("./category"));
router.use(require("./company"));
router.use(require("./coupon"));
router.use(require("./manufacturer"));
router.use(require("./order"));
router.use(require("./product"));
router.use(require("./slider"));
router.use(require("./user"));

module.exports = router;
