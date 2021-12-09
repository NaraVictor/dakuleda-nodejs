const status = require("http-status");
const _ = require("lodash");

const { Manufacturer } = require("../models");

const has = require("has-keys");

module.exports = {
	async getManufacturerById(req, res, next) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			if (!parseInt(id)) next();

			let data = await Manufacturer.findOne({ where: { id } });

			if (!data)
				throw { code: status.BAD_REQUEST, message: "Manufacturer not found" };

			res.json({ status: true, message: "Returning manufacturer", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getManufacturers(req, res) {
		try {
			let data = await Manufacturer.findAll({});
			res.json({ status: true, message: "Returning manufacturers", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newManufacturer(req, res) {
		try {
			if (!has(req.body, ["name", "email"]))
				return res.status(400).send({
					code: status.BAD_REQUEST,
					message: "Manufacturer name and email must be specified",
				});

			const data = await Manufacturer.create({
				name: req.body.name,
				email: req.body.email,
				website: req.body.website,
			});

			res.json({ status: true, message: "Manufacturer Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async updateManufacturer(req, res) {
		try {
			if (!has(req.body, ["id", "name"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and name of the manufacturer",
				};

			const data = await Manufacturer.update(
				{
					name: req.body.name,
					email: req.body.email,
					website: req.body.website,
				},
				{
					where: { id: req.body.id },
				}
			);

			res.json({ status: true, message: "Manufacturer updated", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteManufacturer(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await Manufacturer.findOne({
				where: { id },
			}).destroy();

			res.json({ status: true, message: "Manufacturer deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
