const status = require("http-status");
const _ = require("lodash");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { Category, Product } = require("../models");

const has = require("has-keys");
const { generateSlug } = require("../util/helpers");

module.exports = {
	async getCategoryBySlug(req, res, next) {
		try {
			if (!has(req.params, "slug"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the slug",
				};

			const data = await Category.findOne({
				where: { slug: req.params.slug, isDeleted: false },
				include: [
					{
						model: Product,
						as: "products",
						attributes: [
							"id",
							"name",
							"slug",
							"description",
							"imageUrl",
							"videoUrl",
							"giftEligible",
							"freeDelivery",
							"regularPrice",
							"newPrice",
						],
						where: { isDeleted: false },
					},
				],
			});

			res.json({ status: true, message: "Returning categories", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getCategories(req, res) {
		try {
			const data = await Category.findAll({ where: { isDeleted: false } });
			res.json({ status: true, message: "Returning categories", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newCategory(req, res) {
		try {
			if (!has(req.body, ["name"]))
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					message: "Category name must be specified",
				});

			// check existance of slug
			const genSlug = generateSlug(req.body.name);
			const categoryExist = await Category.findOne({
				where: { slug: genSlug },
			});

			if (categoryExist)
				return res.status(status.CONFLICT).send({
					code: status.CONFLICT,
					message: "category with the same slug exists",
				});

			const data = await Category.create({
				name: req.body.name,
				description: req.body.description,
				// slug: req.body.slug, //auto generated
			});

			res.json({ status: true, message: "Category Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async uploadPicture(req, res) {
		try {
			const category = await Category.findOne({
				where: { id: req.params.id },
			});

			if (!category)
				return res.status(status.NOT_FOUND).send({ msg: "category not found" });

			// upload file
			file = req.files.categoryImage;
			const newName = uuidv4() + path.extname(file.name);
			uploadPath = path.join(__dirname, "../../public/uploads/images", newName);
			file.mv(uploadPath, function (err) {
				if (err) return res.status(500).send(err);
			});

			// update category information
			category.imageUrl = uploadPath;
			category.imageFileName = newName;
			// category.originalFileName = file.name;
			category.save();

			return res.json({
				status: true,
				message: "category picture uploaded",
				data: category,
			});
		} catch (ex) {
			console.log("error -> ", ex);
			return res.status(500).send({ msg: "error" });
		}
	},
	async updateCategory(req, res) {
		try {
			if (!has(req.body, ["id"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify category id",
				};

			// update image

			const data = await Category.update(
				{
					name: req.body.name,
					description: req.body.description,
					slug: generateSlug(req.body.name),
				},
				{
					where: { id: req.body.id },
				}
			);

			res.json({ status: true, message: "category updated", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteCategory(req, res) {
		try {
			if (!has(req.params, "id"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { id } = req.params;

			const category = await Category.findOne({
				where: { id },
			});
			category.isDeleted = !category.isDeleted;
			await category.save();

			res.json({ status: true, message: "Category deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
