("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ProductFeature extends Model {
		static associate(models) {
			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "product",
			});
		}
	}

	// contains features specific to products e.g. size of shoe, ram of laptop etc
	// this allows for arbitrary feature list for products

	ProductFeature.init(
		{
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "products",
				},
			},
			title: {
				type: DataTypes.STRING,
			},
			feature: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "product_features",
			modelName: "ProductFeature",
		}
	);
	return ProductFeature;
};
