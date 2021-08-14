const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Report = require('./Report');
const WorkShiftExpense = require('./WorkShiftExpense');

const WorkShift = db.define('WorkShift', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  openingTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  closingTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  openingBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  closingBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  collection: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  revenue: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
    allowNull: false,
  },
  receipts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

WorkShift.hasMany(Report, { onDelete: 'cascade' });
WorkShift.hasMany(WorkShiftExpense, { onDelete: 'cascade' });

module.exports = WorkShift;
