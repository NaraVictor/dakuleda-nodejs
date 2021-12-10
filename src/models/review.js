("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Review extends Model {
		static associate(models) {
			this.belongsTo(models.Product, {
				foreignKey: "productId",
				as: "reviews",
			});
		}
	}
	Review.init(
		{
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "products",
				},
			},
			name: {
				type: DataTypes.STRING,
			},
			phone: {
				type: DataTypes.STRING,
			},
			comment: {
				type: DataTypes.STRING,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			tableName: "product_reviews",
			modelName: "Review",
		}
	);
	return Review;
};
