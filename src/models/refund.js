("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Refund extends Model {
		static associate(models) {
			this.belongsTo(models.Order, {
				foreignKey: "orderId",
				as: "order",
			});
		}
	}
	Refund.init(
		{
			orderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "orders",
				},
			},
			reason: {
				type: DataTypes.STRING,
			},
			accepted: {
				type: DataTypes.BOOLEAN,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			tableName: "refunds",
			modelName: "Refund",
		}
	);
	return Refund;
};
