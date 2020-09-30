const {DataTypes} = require('sequelize');
const User = require('./User');
const db = require('../config/database');

const Company = db.define('Company', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Company;