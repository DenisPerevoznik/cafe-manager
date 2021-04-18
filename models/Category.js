const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Product = require('./Product');

const Category = db.define('Category', {
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
  published: {
    type: DataTypes.BOOLEAN,
    defautlValue: true,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#2196f3',
  },
});

Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = Category;
