const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const WorkShift = require('../models/WorkShift');
const router = Router();
const config = require('config');
const getDate = require('../utils/functions');
const { check, validationResult } = require('express-validator');
const colors = require('colors');

router.post('/daily', [
    auth,
    check('yearAndMonth', 'Значение "yearAndMonth" должно быть строкой').isString().isLength({min: 6, max: 7})
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg});
        }

        const {companyId, yearAndMonth} = req.body;
        WorkShift.findAll({where: {CompanyId: companyId}})
        .then(workShifts => workShifts.filter(w => w.date.startsWith(yearAndMonth)))
        .then(async filteredShifts => {

            res.json(getDailyChartData(await generateDataByShifts(filteredShifts, 2)))
        });
    } catch (error) {
        res.status(400).json({message: config.get('unknownErrorMessage')});
    }
});

router.post('/monthly', [
    auth,
    check('year', 'Значение "year" должно быть четырехзначным числом').isInt({min: 2020, max: 2100}),
], async (req, res) => {

    try {
        const {companyId, year} = req.body;
        WorkShift.findAll({where: {CompanyId: companyId}})
        .then(workShifts => workShifts.filter(w => w.date.startsWith(year)))
        .then(async filteredShifts => {

            res.json(getMonthlyChartData(await generateDataByShifts(filteredShifts, 1)))
        });
    } catch (error) {
        res.status(400).json({message: config.get('unknownErrorMessage')});
    }
});

function getMonthlyChartData(data){

    const revenueArr = [];
    const profitArr = [];
    const receiptArr = [];
    
    for (let i = 1; i <= 12; i++) {
        const month = i < 10 ? `0${i}` : `${i}`;
        if(!data[month]){
            revenueArr.push(0);
            profitArr.push(0);
            receiptArr.push(0);
        }else{
            revenueArr.push(data[month].revenue);
            profitArr.push(data[month].profit);
            receiptArr.push(data[month].receipts);
        }
    }

    return {revenueArr, profitArr, receiptArr};
}

function getDailyChartData(data){

    const revenueArr = [];
    const profitArr = [];
    const receiptArr = [];
    Object.values(data).forEach(item => {
        revenueArr.push(item.revenue);
        profitArr.push(item.profit);
        receiptArr.push(item.receipts);
    });

    return {labels: Object.keys(data).map(key => `${key} число`), revenueArr, profitArr, receiptArr};
}

async function generateDataByShifts(workShifts, dateSplitIndex){

    const data = {};
    for (const shift of workShifts) {
        
        const dateValue = shift.date.split('-')[dateSplitIndex];
        const reports = await shift.getReports();
        const revenue = parseFloat(shift.revenue);
        let costAmount = 0;

        for (const report of reports) {
            const product = await report.getProduct();
            costAmount += product.costPrice * report.quantity;
        }

        if(typeof data[dateValue] !== 'undefined'){
            data[dateValue].revenue += revenue;
            data[dateValue].profit += revenue - costAmount;
            data[dateValue].receipts += shift.receipts;
        }
        else{
            data[dateValue] = {revenue, profit: revenue - costAmount, receipts: shift.receipts};
        }
    }

    return data;
}

module.exports = router;