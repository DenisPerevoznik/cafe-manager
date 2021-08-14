const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Account = require('./Account');
const Employee = require('./Employee');
const Category = require('./Category');
const Expense = require('./Expense');
const Product = require('./Product');
const Report = require('./Report');
const WorkShift = require('./WorkShift');
const Ingredient = require('./Ingredient');
const Delivery = require('./Delivery');
const Supplier = require('./Supplier');
const DeliveryIngredients = require('./DeliveryIngredients');
const ProductIngredients = require('./ProductIngredients');
const WorkShiftExpense = require('./WorkShiftExpense');

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
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mainAccount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lastSync: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

Company.hasMany(Account, { onDelete: 'cascade' });
Company.hasMany(Product, { onDelete: 'cascade' });
Company.hasMany(Report, { onDelete: 'cascade' });
Company.hasMany(Employee, { onDelete: 'cascade' });
Company.hasMany(WorkShift, { onDelete: 'cascade' });
Company.hasMany(Expense, { onDelete: 'cascade' });
Company.hasMany(Category, { onDelete: 'cascade' });
Company.hasMany(Ingredient, { onDelete: 'cascade' });
Company.hasMany(Delivery, { onDelete: 'cascade' });
Company.hasMany(Supplier, { onDelete: 'cascade' });
Company.hasMany(DeliveryIngredients, { onDelete: 'cascade' });
Company.hasMany(ProductIngredients, { onDelete: 'cascade' });
Company.hasMany(WorkShiftExpense, { onDelete: 'cascade' });

module.exports = Company;
