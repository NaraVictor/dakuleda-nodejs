("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PriceSchedule extends Model {
		static associate(models) {
			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "product",
			});
		}
	}
	PriceSchedule.init(
		{
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "products",
				},
			},
			price: {
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			start: {
				type: DataTypes.DATEONLY,
			},
			end: {
				type: DataTypes.DATEONLY,
			},
		},
		{
			sequelize,
			tableName: "price_schedules",
			modelName: "PriceSchedule",
		}
	);
	return PriceSchedule;
};

//  promotional prices attached to a particular product. where prices can be automated for a period of time
// e.g. btw jan 01-30, motor prices are 3k then back to normal after that
