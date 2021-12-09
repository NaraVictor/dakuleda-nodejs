("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Manufacturer extends Model {
		static associate(models) {
			this.hasMany(models.Product, {
				foreignKey: "manufacturerId",
				as: "products",
			});
		}
	}
	Manufacturer.init(
		{
			name: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			website: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "manufacturers",
			modelName: "Manufacturer",
		}
	);
	return Manufacturer;
};
