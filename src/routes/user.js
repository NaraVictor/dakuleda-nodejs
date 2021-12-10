const express = require("express");
const router = express.Router();

const user = require("../controller/user");

router.get("/api/accounts/:id", user.getUserById);

router.get("/api/accounts", user.getUsers);

router.post("/api/accounts/signup", user.signUp);

router.post("/api/accounts/login", user.login);

router.post("/api/accounts/change-password", user.changePassword);

router.delete("/api/accounts/:id", user.updateStatus);

router.put("/api/accounts", user.updateUser);

module.exports = router;
