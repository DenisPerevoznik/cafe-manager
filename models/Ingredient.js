const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Ingredient = db.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defautlValue: 0,
    allowNull: false,
  },
  unit: {
    type: DataTypes.ENUM(['шт.', 'кг.', 'л.']),
    allowNull: false,
    defaultValue: 'шт.',
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Ingredient;
