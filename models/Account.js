
const {DataTypes} = require('sequelize');
const db = require('../config/database');
const Company = require('./Company');

const Account = db.define('Account', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Account;