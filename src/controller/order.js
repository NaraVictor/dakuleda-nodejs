const status = require("http-status");
const _ = require("lodash");

const {
	Order,
	OrderDetail,
	Product,
	Coupon,
	CouponCodes,
} = require("../models");
const { receiptNumberGenerator } = require("../util/helpers");

const has = require("has-keys");
const httpStatus = require("http-status");

module.exports = {
	async getOrderById(req, res, next) {
		try {
			if (!has(req.params, "orderId"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			const data = await Order.findOne({
				where: { id: req.params.orderId },
				include: [
					{
						model: OrderDetail,
						as: "details",
						attributes: ["productId", "price", "quantity"],
						include: {
							model: Product,
							as: "product",
							attributes: ["name", "slug"],
						},
					},
				],
			});

			res.json({ status: true, message: "Returning order information", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async getOrders(req, res) {
		try {
			const data = await Order.findAll({
				order: [["createdAt", "DESC"]],
				include: [
					{
						model: OrderDetail,
						as: "details",
						attributes: ["productId", "price", "quantity"],
						include: {
							model: Product,
							as: "product",
							attributes: ["name", "slug"],
						},
					},
				],
			});
			res.json({ status: true, message: "Returning orders", data });
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async newOrder(req, res) {
		try {
			const paymentMode = req.body.paymentMode;
			let order = null;
			let coupon = null;

			// ensure that order has line items n order total fields
			if (!has(req.body, ["orderTotal"]))
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					source: "orderTotal",
					message: "Order total must be specified",
				});

			if (req.body.orderLine.length === 0)
				return res.status(status.NOT_FOUND).send({
					code: status.NOT_FOUND,
					source: "orderLine",
					message: "no order items found",
				});

			// validate required fields ----  (replace with a library)
			if (paymentMode.length === 0)
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					source: "paymentMode",
					message: "mode of payment is required",
				});

			// if coupon present, ensure its not used already
			if (req.body.couponCode) {
				// fetch corresponding coupon information n apply to order
				coupon = await CouponCodes.findOne({
					where: { code: req.body.couponCode, isUsed: false },
					attributes: ["id", "code", "isUsed"],
					include: [
						{
							model: Coupon,
							attributes: ["title", "isDeleted", "amount"],
							as: "couponParent",
						},
					],
				});
			}

			// on invalid coupon
			if (!coupon)
				return res.status(status.NOT_FOUND).send({
					code: status.NOT_FOUND,
					source: "coupon",
					message: "invalid coupon",
				});

			// on expired coupon
			if (coupon.couponParent.isDeleted)
				return res.status(status.BAD_REQUEST).send({
					code: status.BAD_REQUEST,
					source: "coupon",
					message: "coupon expired",
				});

			// create order instance
			order = await Order.create({
				orderTotal: req.body.orderTotal,
				paymentMode: req.body.paymentMode,
				customerName: req.body.customerName,
				primaryContact: req.body.primaryContact,
				secondaryContact: req.body.secondaryContact,
				email: req.body.email,
				location: req.body.location,
				nearestLandmark: req.body.nearestLandmark,
			});

			// add specific details based on payment mode
			if (paymentMode.toLowerCase() === "cash") {
				// customer is paying cash
				// if cash payment has coupon, apply it to order

				if (coupon) {
					// add coupon information if coupon code was used during checkout
					order.couponCodesId = coupon.id;
					order.couponCode = coupon.code;
					order.couponAmt = coupon.couponParent.amount;
				}

				order.deliveryMethod = req.body.deliveryMethod;
			} else {
				// hire purchase
				order.governmentWorker = req.body.governmentWorker;
				order.businessOwner = req.body.businessOwner;
				order.creditDuration = req.body.creditDuration;
			}

			// generate receipt number
			order.receiptNumber = receiptNumberGenerator(order.id);
			await order.save();

			// create order line
			const details = req.body.orderLine.map((item) => {
				return {
					orderId: order.id,
					productId: item.id,
					price: item.price,
					quantity: item.quantity,
				};
			});

			await OrderDetail.bulkCreate(details);

			res.json({
				status: true,
				message: "Order Added",
				data: order,
			});
		} catch (ex) {
			console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async approveOrder(req, res) {
		try {
			if (!has(req.params, ["orderId"]))
				throw {
					code: status.BAD_REQUEST,
					message: "You must specify the id ",
				};

			const data = await Order.update(
				{
					status: req.body.status,
					comment: req.body.comment,
					approvedBy: req.user.id,
					approvalDate: Date.now(),
				},
				{
					where: { id: req.params.orderId },
				}
			);

			// if there is a coupon, update coupon isUsed state
			if (data.couponCode) {
				await CouponCodes.update(
					{
						isUsed: true,
					},
					{
						where: { code: data.couponCode },
					}
				);
			}

			res.json({ status: true, message: "order updated", data });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
	async deleteOrder(req, res) {
		try {
			if (!has(req.params, "orderId"))
				throw { code: status.BAD_REQUEST, message: "You must specify the id" };

			let { orderId } = req.params;

			const order = await Order.findOne({
				where: { id: orderId },
			});

			const details = await OrderDetail.findAll({
				where: { orderId },
			});

			details.destroy();
			order.destroy();

			// delete both order and its details

			res.json({ status: true, message: "Order deleted" });
		} catch (ex) {
			// console.log(ex);
			res.status(status.INTERNAL_SERVER_ERROR).send({ msg: "error" });
		}
	},
};
