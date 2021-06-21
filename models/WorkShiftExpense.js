const { DataTypes } = require('sequelize');
const db = require('../config/database');

const WorkShiftExpense = db.define('WorkShiftExpense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  sum: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    defaultValue: 0
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Без комментария'
  }
});

module.exports = WorkShiftExpense;