("use strict");
const { Model } = require("sequelize");
const { generateSlug } = require("../util/helpers");
module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
		static associate(models) {
			this.hasMany(models.Product, {
				foreignKey: "categoryId",
				as: "products",
			});
		}
	}
	Category.init(
		{
			name: {
				type: DataTypes.STRING,
			},
			imageUrl: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.STRING,
			},
			slug: {
				type: DataTypes.STRING,
			},
		},
		{
			hooks: {
				beforeCreate: (category, options) => {
					category.slug = generateSlug(category.name);
				},

				// activate this if the update isnt affecting it
				// beforeSave: (category, options) => {
				// 	category.slug = generateSlug(category.name);
				// },
			},
			sequelize,
			tableName: "categories",
			modelName: "Category",
		}
	);
	return Category;
};
