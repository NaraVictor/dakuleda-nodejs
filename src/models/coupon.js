("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Coupon extends Model {
		static associate(models) {
			this.hasMany(models.CouponCodes, {
				foreignKey: "couponId",
				as: "codes",
			});
		}
	}
	Coupon.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
			},
			startDate: {
				type: DataTypes.DATEONLY,
			},
			endDate: {
				type: DataTypes.DATEONLY,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			amount: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
				allowNull: false,
			},
			// imageUrl: {
			// 	type: DataTypes.STRING,
			// 	allowNull: true,
			// },
		},
		{
			sequelize,
			tableName: "coupons",
			modelName: "Coupon",
		}
	);
	return Coupon;
};

// re-evaluate coupon automatic generation system
// gifts/presents/promotions
