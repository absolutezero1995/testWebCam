'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    static associate({User}) {
      this.belongsTo(User, {foreignKey: 'user_id'})
    }
  }
  Rate.init({
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    total: {
      allowNull: false,
      type: DataTypes.INTEGER,
      },
  }, {
    sequelize,
    modelName: 'Rate',
  });
  return Rate;
};