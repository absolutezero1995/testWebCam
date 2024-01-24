'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate({Category}) {
      this.belongsTo(Category, {foreignKey: 'category_id'})
    }
  }
  Question.init({
    category_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Categories",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    question: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    answer: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    rate: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};