const db = require('../config/database');
const { DataTypes } = require('sequelize');
const Ingredient = require('./Ingredient');
const Product = require('./Product');

const ProductIngredients = db.define('product_ingredients', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ProductId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
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
  usingInOne: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defautlValue: 0,
  }
}, {timestamps: false});

Product.belongsToMany(Ingredient, { through: ProductIngredients });
Ingredient.belongsToMany(Product, { through: ProductIngredients });

module.exports = ProductIngredients;