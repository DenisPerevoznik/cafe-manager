const {DataTypes} = require('sequelize');
const db = require('../config/database');

const Company = db.define('Company', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
});

module.exports = Company;