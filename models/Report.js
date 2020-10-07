const {DataTypes} = require('sequelize');
const db = require('../config/database');

const Report = db.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

module.exports = Report;