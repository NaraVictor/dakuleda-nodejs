("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class SubCategory extends Model {
		static associate(models) {}
	}
	SubCategory.init(
		{
			name: {
				type: DataTypes.STRING,
			},
			image: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.STRING,
			},
			slug: {
				type: DataTypes.STRING,
			},
			categoryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "categories",
				},
			},
		},
		{
			sequelize,
			tableName: "sub_categories",
			modelName: "SubCategory",
		}
	);
	return SubCategory;
};
