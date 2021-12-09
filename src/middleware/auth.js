const config = require("config");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	const token = req.header("authorization");
	if (!token) return res.status(401).send("Access denied. No token provided");

	try {
		const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(400).send("Invalid token");
	}
}

module.exports = authenticateToken;
