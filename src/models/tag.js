("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Tag extends Model {
		static associate(models) {
			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "product",
			});
		}
	}

	Tag.init(
		{
			tagName: {
				type: DataTypes.STRING,
			},
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "products",
				},
			},
		},
		{
			sequelize,
			tableName: "tags",
			modelName: "Tag",
		}
	);
	return Tag;
};
