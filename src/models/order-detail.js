("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class OrderDetail extends Model {
		static associate(models) {
			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "product",
			});
			this.belongsTo(models.Order, {
				foreignKey: "orderId",
				as: "order",
			});
		}
	}
	OrderDetail.init(
		{
			orderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "orders",
				},
			},
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
			quantity: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			tableName: "order_details",
			modelName: "OrderDetail",
		}
	);
	return OrderDetail;
};
