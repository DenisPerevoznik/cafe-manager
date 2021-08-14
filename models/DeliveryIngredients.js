const db = require('../config/database');
const { DataTypes } = require('sequelize');
const Ingredient = require('./Ingredient');
const Delivery = require('./Delivery');

const DeliveryIngredients = db.define('delivery_ingredients', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  DeliveryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Delivery,
      key: 'id'
    }
  },
  IngredientId: {
    type: DataTypes.INTEGER,
    references: {
      model: Ingredient,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defautlValue: 0,
  },
  sum: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defautlValue: 0,
  }
}, {timestamps: false});

Delivery.belongsToMany(Ingredient, { through: DeliveryIngredients });
Ingredient.belongsToMany(Delivery, { through: DeliveryIngredients });

module.exports = DeliveryIngredients;