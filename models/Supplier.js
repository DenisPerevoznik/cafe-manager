const db = require('../config/database');
const { DataTypes } = require('sequelize');
const Delivery = require('./Delivery');

const Supplier = db.define('Supplier', {
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
  egrpou: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxpayerNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Supplier.hasMany(Delivery);
Delivery.belongsTo(Supplier);

module.exports = Supplier;
