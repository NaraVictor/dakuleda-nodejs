const status = require("http-status");
const _ = require("lodash");

const { Company } = require("../models");

const has = require("has-keys");

module.exports = {
	async getCompany(req, res) {
		try {
			const data = await Company.findAll();
			res.json({ status: true, message: "Returning company info", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async createProfile(req, res) {
		try {
			if (!has(req.body, ["companyName", "email"]))
				return res.status(400).send({
					code: status.BAD_REQUEST,
					message: "Company name and email must be specified",
				});

			const data = await Company.create({
				companyName: req.body.companyName,
				description: req.body.description,
				invoiceAbbr: req.body.invoiceAbbr,
				address: req.body.address,
				mobile: req.body.mobile,
				office: req.body.office,
				email: req.body.email,
				facebook: req.body.facebook,
				instagram: req.body.instagram,
				twitter: req.body.twitter,
				linkedin: req.body.linkedin,
				website: req.body.website,
			});

			// upload company logo
			// data.logoUrl = image path
			// data.save();

			res.json({ status: true, message: "Company profile created", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async updateCompany(req, res) {
		try {
			if (!has(req.body, ["id", "companyName"]))
				throw {
					code: status.BAD_REQUEST,
					message: "Company name and id must be specified",
				};

			const { id } = req.params;

			const data = await Company.update(
				{
					companyName: req.body.companyName,
					description: req.body.description,
					invoiceAbbr: req.body.invoiceAbbr,
					address: req.body.address,
					mobile: req.body.mobile,
					office: req.body.office,
					email: req.body.email,
					facebook: req.body.facebook,
					instagram: req.body.instagram,
					twitter: req.body.twitter,
					linkedin: req.body.linkedin,
					website: req.body.website,
				},
				{
					where: { id },
				}
			);

			res.json({ status: true, message: "company profile updated", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteCompany(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			// await

			res.json({ status: true, message: "Product deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
