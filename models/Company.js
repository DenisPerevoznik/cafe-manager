const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Account = require('./Account');
const Employee = require('./Employee');
const Expense = require('./Expense');
const Product = require('./Product');
const Report = require('./Report');
const WorkShift = require('./WorkShift');

const Company = db.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mainAccount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Company.hasMany(Account, { onDelete: 'cascade' });
Company.hasMany(Product, { onDelete: 'cascade' });
Company.hasMany(Report, { onDelete: 'cascade' });
Company.hasMany(Employee, { onDelete: 'cascade' });
Company.hasMany(WorkShift, { onDelete: 'cascade' });
Company.hasMany(Expense, { onDelete: 'cascade' });

module.exports = Company;
