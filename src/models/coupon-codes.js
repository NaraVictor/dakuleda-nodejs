("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class CouponCodes extends Model {
		static associate(models) {
			this.belongsTo(models.Coupon, {
				foreignKey: "couponId",
				as: "coupon",
			});
			this.hasOne(models.Order, {
				foreignKey: "couponCodesId",
				as: "order",
			});
		}
	}
	CouponCodes.init(
		{
			couponId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "coupons",
				},
			},
			code: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			isUsed: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			tableName: "coupon_codes",
			modelName: "CouponCodes",
		}
	);
	return CouponCodes;
};

// re-evaluate coupon detail automatic generation system
// gifts/presents/promotions
