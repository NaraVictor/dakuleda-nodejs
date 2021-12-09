("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// define association here
			this.hasMany(models.Order, {
				foreignKey: "approvedBy",
				as: "orders",
			});

			this.hasMany(models.Product, {
				foreignKey: "userId",
				as: "products",
			});
		}
	}
	User.init(
		{
			fullName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},
		{
			sequelize,
			tableName: "users",
			modelName: "User",
		}
	);
	return User;
};
