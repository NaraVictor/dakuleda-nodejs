("use strict");
const { Model } = require("sequelize");
const { generateSlug } = require("../util/helpers");
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.Category, {
				foreignKey: "categoryId",
				as: "category",
			});

			// this.belongsTo(models.SubCategory, {
			// 	foreignKey: {
			// 		name: "subCategoryId",
			// 		allowNull: true,
			// 	},
			// 	as: "subCategory",
			// });

			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});

			this.belongsTo(models.Manufacturer, {
				foreignKey: "manufacturerId",
				as: "manufacturer",
			});

			this.hasMany(models.OrderDetail, {
				foreignKey: "productId",
				as: "orders",
			});

			this.hasMany(models.ProductFeature, {
				foreignKey: "productId",
				as: "features",
			});

			this.hasMany(models.Gallery, {
				foreignKey: "productId",
				as: "gallery",
			});

			this.hasMany(models.Review, {
				foreignKey: "productId",
				as: "reviews",
			});

			this.hasMany(models.Tag, {
				foreignKey: "productId",
				as: "tags",
			});

			// one to one relationship
			this.hasOne(models.PriceSchedule, {
				foreignKey: "productId",
				as: "priceSchedule",
			});
		}
	}
	Product.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
				},
			},
			categoryId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "categories",
				},
			},
			manufacturerId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "manufacturers",
				},
			},
			name: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			slug: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			SKU: {
				type: DataTypes.STRING,
			},

			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			giftEligible: {
				type: DataTypes.BOOLEAN,
			},
			freeDelivery: {
				type: DataTypes.BOOLEAN,
			},
			purchasePrice: {
				//cost price of item
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			regularPrice: {
				// regular price in the open market
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			newPrice: {
				// our special price that beats the market competition
				type: DataTypes.DECIMAL,
				defaultValue: 0.0,
			},
			location: {
				type: DataTypes.STRING,
			},
			orderCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			imageUrl: {
				// primary product image
				type: DataTypes.STRING,
			},
			imageFileName: {
				// primary product image
				type: DataTypes.STRING,
			},
			videoUrl: {
				type: DataTypes.STRING,
			},
			videoFileName: {
				// primary product image
				type: DataTypes.STRING,
			},

			//// REASON: there is no inventory to manage here
			// quantity: {
			// 	type: DataTypes.INTEGER,
			// },
			// minStock: {
			// 	type: DataTypes.INTEGER,
			// 	defaultValue: 0,
			// 	comment: "product's minimum quantity the system should monitor for",
			// },
			// maxStock: {
			// 	type: DataTypes.INTEGER,
			// 	defaultValue: 0,
			// 	comment: "product's maximum quantity the system should monitor for",
			// },
			// restockQty: {
			// 	type: DataTypes.INTEGER,
			// 	defaultValue: 5,
			// 	comment: "product's maximum quantity the system should monitor for",
			// },
		},
		{
			hooks: {
				beforeCreate: (product, options) => {
					product.slug = generateSlug(product.name);
				},
			},
			sequelize,
			tableName: "products",
			modelName: "Product",
		}
	);
	return Product;
};
