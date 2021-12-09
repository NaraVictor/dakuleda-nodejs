const status = require("http-status");
const _ = require("lodash");

const { Slider } = require("../models");

const has = require("has-keys");

module.exports = {
	async getSliderById(req, res, next) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			const data = Slider.findOne({
				where: { id: req.params.id },
			});

			res.json({ status: true, message: "Returning slider", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getSliders(req, res) {
		try {
			let data = await Slider.findAll({});
			res.json({ status: true, message: "Returning sliders", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newSlider(req, res) {
		try {
			if (!has(req.body, ["title", "description"]))
				return res.status(400).send({
					code: status.BAD_REQUEST,
					message: "Slider title and description must be specified",
				});

			const data = await Slider.create({
				title: req.body.title,
				description: req.body.description,
				url: req.body.url,
				isActive: req.body.isActive,
				hasButton: req.body.hasButton,
				buttonText: req.body.buttonText,
			});

			// upload image here
			// data.imageUrl = image path here

			res.json({ status: true, message: "Slider Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async updateSlider(req, res) {
		try {
			if (!has(req.body, ["id", "title"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and title of the slider",
				};

			const data = await Slider.update(
				{
					title: req.body.title,
					description: req.body.description,
					url: req.body.url,
					isActive: req.body.isActive,
					hasButton: req.body.hasButton,
					buttonText: req.body.buttonText,
				},
				{
					where: { id: req.body.id },
				}
			);

			res.json({ status: true, message: "slider information updated", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteSlider(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			await Slider.findOne({
				where: { id },
			}).destroy();

			res.json({ status: true, message: "Slider deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
