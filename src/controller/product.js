const status = require("http-status");
const _ = require("lodash");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const {
	Product,
	Category,
	Manufacturer,
	ProductFeature,
	Gallery,
	Review,
	Tag,
	User,
} = require("../models");

const has = require("has-keys");
const { generateSlug } = require("../util/helpers");
module.exports = {
	// GET
	// ===============================
	async getProductBySlug(req, res) {
		try {
			if (!has(req.params, "slug"))
				throw { code: status.BAD_REQUEST, message: "You must specify a slug" };

			let { slug } = req.params;

			// if (!parseInt(productId)) next();

			let data = await Product.findOne({
				where: { slug, isDeleted: false },
				include: [
					{
						model: ProductFeature,
						as: "features",
					},
					{
						model: Gallery,
						as: "gallery",
					},
					{
						model: User,
						as: "user",
						attributes: ["fullName", "username"],
					},
					// {
					// 	model: Manufacturer,
					// 	as: "manufacturer",
					// },
					// {
					// 	model: Category,
					// 	as: "category",
					// 	attributes: ["name", "image", "slug"],
					// },
					// {
					// 	model: Review,
					// 	as: "reviews",
					// },
				],
			});

			if (!data)
				throw { code: status.BAD_REQUEST, message: "Product not found" };

			res.json({ status: true, message: "Returning product", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getProducts(req, res) {
		try {
			let data = await Product.findAll({
				where: { isDeleted: false },
				order: [["name", "ASC"]],
				include: [
					{
						model: Category,
						as: "category",
						attributes: ["name", "imageUrl", "imageFileName", "slug"],
					},
					{
						model: Manufacturer,
						as: "manufacturer",
					},
					{
						model: User,
						as: "user",
						attributes: ["fullName", "username"],
					},
				],
			});
			res.json({ status: true, message: "Returning products", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async getFeatures(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = ProductFeature.findAll({
				where: { productId },
			});

			res.json({ status: true, message: "Returning product features", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async getGallery(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = Gallery.findAll({
				where: { productId },
			});

			res.json({ status: true, message: "Returning product gallery", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async getReviews(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = Review.findAll({
				where: { productId },
			});

			res.json({ status: true, message: "Returning product reviews", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async getTags(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = Tag.findAll({
				where: { productId },
			});

			res.json({ status: true, message: "Returning product tags", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	// PUT / POST
	// ====================================
	async newProduct(req, res) {
		try {
			if (!has(req.body, ["name", "regularPrice"]))
				return res.status(400).send({
					code: status.BAD_REQUEST,
					message: "Product name and regular price must be specified",
				});

			const conflict = await Product.findOne({
				where: { name: req.body.name },
			});

			if (conflict)
				return res.status(409).send({
					code: status.CONFLICT,
					message: `A product with the same name '${req.body.name}' exists.`,
				});

			let data = await Product.create({
				name: req.body.name,
				slug: req.body.slug,
				description: req.body.description,
				SKU: req.body.SKU,
				giftEligible: req.body.giftEligible,
				freeDelivery: req.body.freeDelivery,
				purchasePrice: req.body.purchasePrice,
				regularPrice: req.body.regularPrice,
				newPrice: req.body.newPrice,
				location: req.body.location,
				categoryId: req.body.categoryId,
				manufacturerId: req.body.manufacturerId,
				userId: req.user.id,
			});

			/* 
			 if product added without errors then
			 implement image and video uploads
			 -->
			 imageUrl: req.body.imageUrl,
			 videoUrl: req.body.videoUrl,
			 */

			res.json({ status: true, message: "Product Added", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async uploadPicture(req, res) {
		try {
			const product = await Product.findOne({
				where: { id: req.params.productId },
			});

			if (!product)
				return res.status(status.NOT_FOUND).send({ msg: "product not found" });

			// upload file
			file = req.files.productImage;
			const newName = uuidv4() + path.extname(file.name);
			uploadPath = path.join(__dirname, "../../public/uploads/images", newName);
			file.mv(uploadPath, function (err) {
				if (err) return res.status(500).send(err);
			});

			// update product information
			product.imageUrl = uploadPath;
			product.imageFileName = newName;
			// product.originalFileName = file.name;
			product.save();

			return res.json({
				status: true,
				message: "product picture uploaded",
				data: product,
			});
		} catch (ex) {
			console.log("error -> ", ex);
			return res.status(500).send({ msg: "error" });
		}
	},
	async updateProduct(req, res) {
		try {
			if (!has(req.body, ["id", "name"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id and name of the product",
				};

			let data = await Product.update(
				{
					name: req.body.name,
					slug: generateSlug(req.body.name),
					description: req.body.description,
					SKU: req.body.SKU,
					giftEligible: req.body.giftEligible,
					freeDelivery: req.body.freeDelivery,
					purchasePrice: req.body.purchasePrice,
					regularPrice: req.body.regularPrice,
					newPrice: req.body.newPrice,
					location: req.body.location,
					categoryId: req.body.categoryId,
					manufacturerId: req.body.manufacturerId,
				},
				{ where: { id: req.body.id } }
			);

			res.json({ status: true, message: "product updated", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async newFeature(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = ProductFeature.create({
				productId,
				title: req.body.title,
				feature: req.body.feature,
			});

			res.json({ status: true, message: "Product feature created", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	async newGallery(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = Gallery.create({
				productId,
				imageUrl: req.body.imageUrl,
			});

			res.json({
				status: true,
				message: "Image added to product gallery",
				data,
			});
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newReview(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = Review.create({
				productId,
				name: req.body.name,
				phone: req.body.phone,
				comment: req.body.comment,
			});

			res.json({
				status: true,
				message: "Review added",
				data,
			});
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newTag(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			if (!parseInt(productId)) next();

			const data = Tag.create({
				productId,
				tagName: req.body.tagName,
			});

			res.json({
				status: true,
				message: "Product tag added",
				data,
			});
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},

	// DELETE
	//  =============================
	async deleteProduct(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;

			await Product.update({ isDeleted: true }, { where: { id: productId } });
			res.json({ status: true, message: "Product deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteTag(req, res) {
		try {
			if (!has(req.param, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;

			const tag = await Tag.findOne({
				where: { productId },
			});
			await tag.destroy();
			res.json({ status: true, message: "tag deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteGallery(req, res) {
		try {
			if (!has(req.param, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;

			const gallery = await Gallery.findOne({
				where: { productId },
			});

			// delete image from the system
			await gallery.destroy();
			res.json({ status: true, message: "gallery deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteFeature(req, res) {
		try {
			if (!has(req.params, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			const feature = await ProductFeature.findOne({
				where: { productId },
			});

			await feature.destroy();

			res.json({ status: true, message: "feature deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteReview(req, res) {
		try {
			if (!has(req.param, "productId"))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the product id",
				};

			let { productId } = req.params;
			const review = await Review.findOne({
				where: { productId },
			});

			await review.destroy();

			res.json({ status: true, message: "review deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
