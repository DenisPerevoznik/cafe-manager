const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Expense = require('./Expense');

const Account = db.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
});

Account.hasMany(Expense);
Expense.belongsTo(Account);
module.exports = Account;
