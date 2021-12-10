// // Patches
const { inject, errorHandler } = require("express-custom-error");
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { sequelize } = require("./src/models");
const fileUpload = require("express-fileupload");
const logger = require("./src/util/logger");
const morgan = require("morgan");

const app = express();

// Configure Express App Instance
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(
	fileUpload({
		createParentPath: true,
		preserveExtension: true,
	})
);

app.use(express.static("public"));

// // Configure custom logger middleware
app.use(logger.dev, logger.combined);
// sequelize.sync({ alter: true });

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
	res.setHeader("Content-Type", "application/json");
	next();
});

// Assign Routes
app.use("/", require("./src/routes/router"));

// // Handle errors
app.use(errorHandler());

// Handle not valid route
app.use("*", (req, res) => {
	res.status(404).json({ status: false, message: "Endpoint Not Found" });
});

// Open Server on selected Port
const PORT = 2021;
app.listen(PORT, () => {
	console.log("app is running on port ", PORT);
});
