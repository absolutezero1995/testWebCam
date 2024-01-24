'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate({Question}) {
      this.hasMany(Question, {foreignKey: 'category_id'})
    }
  }
  Category.init({
    title: {
      allowNull: false,
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};