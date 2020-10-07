
const {DataTypes} = require('sequelize');
const db = require('../config/database');
const Report = require('./Report');

const WorkShift = db.define('WorkShift', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    openingTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    closingTime: {
        type: DataTypes.TIME,
        allowNull: true
    },
    openingBalance: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    closingBalance: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0
    },
    collection: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: true
    },
    revenue: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false
    },
    receipts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

WorkShift.hasMany(Report, {onDelete: 'cascade'});

module.exports = WorkShift;