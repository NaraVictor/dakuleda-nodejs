const status = require("http-status");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
const generator = require("generate-password");
const { mailer } = require("../util/helpers");
const has = require("has-keys");
const config = require("config");

module.exports = {
	async login(req, res) {
		try {
			// finding user
			let user = await User.findOne({
				where: {
					email: req.body.email,
				},
			});
			if (!user || !user.isActive)
				return res
					.status(status.BAD_REQUEST)
					.send("invalid username or password");

			// compare password
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);

			if (!validPassword)
				return res
					.status(status.BAD_REQUEST)
					.send("invalid username or password");

			//generate n sign a jwt
			const token = jwt.sign(
				{
					id: user.id,
					email: user.email,
					role: user.role,
				},
				config.get("jwtPrivateKey")
			);
			return res.header("authorization", token).json({
				msg: "success",
				token,
				data: {
					email: user.email,
					role: user.role,
					id: user.id,
					username: user.username,
					fullName: user.fullName,
				},
			});
		} catch (ex) {
			console.log(ex);
			return res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async signUp(req, res) {
		try {
			// finding duplicate users
			let user = await User.findOne({
				where: {
					[Op.or]: [{ username: req.body.username }, { email: req.body.email }],
				},
			});

			// email matches
			if (user)
				return res
					.status(status.CONFLICT)
					.send({ message: "User already exist" });

			// hashing password
			const salt = await bcrypt.genSalt(10);
			const password = await bcrypt.hash(req.body.password, salt);

			user = await User.create({
				password,
				email: req.body.email,
				username: req.body.username,
				role: req.body.role,
				fullName: req.body.fullName,
			});

			// save n return data
			return res.status(status.OK).send({
				data: _.pick(user, ["id", "email", "fullName", "username", "role"]),
				message: "success",
			});
		} catch (ex) {
			// console.log(ex);
			return res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async forgotPassword(req, res) {
		try {
			// check if email exist
			let user = await User.findOne({
				where: { email: req.body.email },
			});
			if (!user)
				return res
					.status(status.NOT_FOUND)
					.send({ msg: "account does not exist" });

			// generate a new password
			const randomPwd = generator.generate({
				length: 10,
				numbers: true,
				excludeSimilarCharacters: true,
			});

			// hash password
			const salt = await bcrypt.genSalt(10);
			const newPassword = await bcrypt.hash(randomPwd, salt);

			// update user record
			user.password = newPassword;
			await user.save();

			// send email
			sendEmail(
				user.email,
				mailer.subjects.passwordReset,
				mailer.messages.passwordReset(randomPwd)
			);

			return res.status(200).send({
				msg: "success",
				data: _.pick(user, ["email", "role", "username"]),
			});
		} catch (err) {
			// console.log("error ", err);
			return res.status(500).send("An internal server error occurred");
		}
	},

	async changePassword(req, res) {
		try {
			const currentPwd = req.body.currentPassword;
			const newPwd = req.body.newPassword;

			// check if old and new passwords are the same
			if (currentPwd === newPwd)
				return res.status(304).send("passwords are the same");

			// check if email exist
			let user = await User.findOne({
				where: { email: req.body.email },
			});
			if (!user)
				return res
					.status(status.NOT_FOUND)
					.send({ msg: "account does not exist" });
			// console.log("user exists");

			// compare passwords
			const validPassword = await bcrypt.compare(currentPwd, user.password);
			if (!validPassword)
				return res.status(status.BAD_REQUEST).send("invalid password");

			// hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPwd = await bcrypt.hash(newPwd, salt);

			// update user record
			user.password = hashedPwd;
			await user.save();

			// send email
			// sendEmail(
			// 	user.email,
			// 	mailer.subjects.passwordChange,
			// 	mailer.messages.passwordChanged()
			// );

			return res.status(200).send({
				msg: "success",
				// data: _.pick(user, ["email", "role", "username"]),
			});
		} catch (err) {
			console.log("error ", err);
			return res.status(500).send("An internal server error occurred");
		}
	},
	async getUserById(req, res) {
		if (!has(req.params, "id"))
			throw { code: status.BAD_REQUEST, message: "You must specify the id" };

		let { id } = req.params;

		let data = await User.findOne({ where: { id } });

		if (!data) throw { code: status.BAD_REQUEST, message: "User not found" };

		res.json({ status: true, message: "Returning user", data });
	},
	async getUsers(req, res) {
		let data = await User.findAll({
			attributes: ["id", "username", "fullName", "role", "email", "isActive"],
		});

		res.json({ status: true, message: "Returning users", data });
	},
	// async newUser(req, res) {
	// 	if (!has(req.body, ["username", "role"]))
	// 		throw {
	// 			code: status.BAD_REQUEST,
	// 			message: "You must specify the username and role",
	// 		};

	// 	let { fullName, email, username, password, role } = req.body;

	// 	const data = await User.create({
	// 		fullName,
	// 		email,
	// 		username,
	// 		password,
	// 		role,
	// 	});

	// 	res.json({ status: true, message: "User Added", data });
	// },
	async updateUser(req, res) {
		if (!has(req.body, ["id", "username"]))
			throw {
				code: status.BAD_REQUEST,
				message: "You must specify the username",
			};

		let { id, fullName, email, username, role } = req.body;
		await User.update({ fullName, email, username, role }, { where: { id } });

		res.json({ status: true, message: "User updated" });
	},
	async updateStatus(req, res) {
		if (!has(req.params, "id"))
			throw { code: status.BAD_REQUEST, message: "You must specify the id" };

		let { id } = req.params;

		const user = await User.findOne({
			where: { id },
		});
		user.isActive = !user.isActive;
		await user.save();

		res.json({ status: true, message: "User status updated" });
	},
};
