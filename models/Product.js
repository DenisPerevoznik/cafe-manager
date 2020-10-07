
const {DataTypes} = require('sequelize');
const db = require('../config/database');
const Report = require('./Report');

const Product = db.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
    },
    published: {
        type: DataTypes.BOOLEAN,
        defautlValue: true,
        allowNull: false
    },
    costPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    isPurchased: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Product.hasMany(Report);
Report.belongsTo(Product);

module.exports = Product;