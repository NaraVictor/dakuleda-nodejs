("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Company extends Model {
		static associate(models) {}
	}
	Company.init(
		{
			companyName: {
				type: DataTypes.STRING,
			},
			logoUrl: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.STRING,
			},
			invoiceAbbr: {
				type: DataTypes.STRING,
			},
			address: {
				type: DataTypes.STRING,
			},
			mobile: {
				type: DataTypes.STRING,
			},
			office: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			facebook: {
				type: DataTypes.STRING,
			},
			instagram: {
				type: DataTypes.STRING,
			},
			twitter: {
				type: DataTypes.STRING,
			},
			linkedin: {
				type: DataTypes.STRING,
			},
			website: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "company",
			modelName: "Company",
		}
	);
	return Company;
};

// dakuleda.com profile info
