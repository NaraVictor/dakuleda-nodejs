const status = require("http-status");
const _ = require("lodash");

const { Coupon, CouponCodes } = require("../models");

const has = require("has-keys");

module.exports = {
	async getCouponById(req, res, next) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			if (!parseInt(id)) next();

			let data = await Coupon.findOne({
				where: { id, isActive: true },
				include: [
					{
						model: CouponCodes,
						as: "codes",
						attributes: ["code", "isUsed"],
					},
				],
			});

			if (!data)
				throw { code: status.BAD_REQUEST, message: "Coupon not found" };

			return res.json({ status: true, message: "Returning Coupon", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getCoupons(req, res) {
		try {
			let data = await Coupon.findAll({
				include: [
					{
						model: CouponCodes,
						as: "codes",
						attributes: ["id", "code", "isUsed"],
					},
				],
			});
			return res.json({ status: true, message: "Returning Coupons", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newCoupon(req, res) {
		try {
			if (!has(req.body, ["title"]))
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					message: "Coupon name and code must be specified",
				});

			const data = Coupon.create({
				title: req.body.title,
				description: req.body.description,
				startDate: req.body.startDate,
				endDate: req.body.endDate,
				amount: req.body.amount,
			});

			return res.json({ status: true, message: "Coupon Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async addCouponCodes(req, res) {
		try {
			if (!has(req.body, ["code"]))
				return res.status(400).send({
					code: status.BAD_REQUEST,
					message: "Coupon code must be specified",
				});

			// process excel file and insert codes into db

			return res.json({ status: true, message: "Coupon codes Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async updateCoupon(req, res) {
		try {
			if (!has(req.body, ["id", "title"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify id and title of the Coupon",
				};

			const data = await Coupon.update(
				{
					title: req.body.title,
					description: req.body.description,
					startDate: req.body.startDate,
					endDate: req.body.endDate,
					isActive: req.body.isActive,
					amount: req.body.amount,
				},
				{
					where: { id: req.body.id },
				}
			);

			return res.json({ status: true, message: "Coupon updated", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteCoupon(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await Coupon.update({ isActive: false }, { where: { id } });
			return res.json({ status: true, message: "Coupon disactived" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
