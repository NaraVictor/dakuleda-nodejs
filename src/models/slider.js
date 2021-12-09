("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Slider extends Model {
		static associate(models) {}
	}
	Slider.init(
		{
			title: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.STRING,
			},
			imageUrl: {
				type: DataTypes.STRING,
			},
			url: {
				type: DataTypes.STRING,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			hasButton: {
				type: DataTypes.BOOLEAN,
			},
			buttonText: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "slider_features",
			modelName: "Slider",
		}
	);
	return Slider;
};
