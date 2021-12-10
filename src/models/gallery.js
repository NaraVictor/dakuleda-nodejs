("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Gallery extends Model {
		static associate(models) {
			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "product",
			});
		}
	}
	Gallery.init(
		{
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "products",
				},
			},
			imageUrl: {
				type: DataTypes.STRING,
			},
			imageFileName: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "gallery",
			modelName: "Gallery",
		}
	);
	return Gallery;
};
