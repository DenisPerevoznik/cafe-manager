
const {DataTypes} = require('sequelize');
const db = require('../config/database');
const WorkShift = require('./WorkShift');

const Employee = db.define('Employee', {
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
    pinCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

Employee.hasMany(WorkShift);
WorkShift.belongsTo(Employee);

module.exports = Employee;