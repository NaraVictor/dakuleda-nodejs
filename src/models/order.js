("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
		static associate(models) {
			this.hasMany(models.OrderDetail, {
				foreignKey: "orderId",
				as: "orderDetails",
			});
			this.belongsTo(models.User, {
				foreignKey: "approvedBy",
				as: "user",
			});

			// one to one relationships
			this.hasOne(models.Refund, {
				foreignKey: "orderId",
				as: "refund",
			});
			this.belongsTo(models.CouponCodes, {
				foreignKey: "couponCodesId",
				as: "coupon",
			});
		}
	}
	Order.init(
		{
			// COUPON
			couponCodesId: {
				//from detail coupons table
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					models: "coupon_codes",
				},
			},
			couponCode: {
				//from coupons detail table
				type: DataTypes.STRING,
			},
			couponAmt: {
				//from parent coupon table
				type: DataTypes.DECIMAL,
				defaultValue: 0,
			},

			paymentMode: {
				// CASH OR HIRE PURCHASE
				type: DataTypes.STRING,
				allowNull: false,
			},

			// HIRE PURCHASE
			governmentWorker: {
				type: DataTypes.BOOLEAN,
			},
			businessOwner: {
				type: DataTypes.BOOLEAN,
			},
			creditDuration: {
				type: DataTypes.STRING,
			},

			// ORDER (CASH)
			customerName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			primaryContact: {
				type: DataTypes.STRING,
			},
			secondaryContact: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			location: {
				type: DataTypes.STRING,
			},
			nearestLandmark: {
				type: DataTypes.STRING,
			},

			// pickup / delivery
			deliveryMethod: {
				type: DataTypes.STRING,
			},
			orderTotal: {
				type: DataTypes.DECIMAL,
			},
			receiptNumber: {
				type: DataTypes.STRING,
			},
			// fulfilled, pending, cancelled
			status: {
				type: DataTypes.STRING,
				defaultValue: "Pending",
			},
			approvedBy: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "users",
				},
			},
			approvalDate: {
				type: DataTypes.DATE,
			},
			comment: {
				type: DataTypes.STRING,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			tableName: "orders",
			modelName: "Order",
		}
	);
	return Order;
};
