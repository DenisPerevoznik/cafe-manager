const db = require('../config/database');
const { DataTypes } = require('sequelize');

const Delivery = db.define('Delivery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  sum: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Delivery;
