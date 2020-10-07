const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const WorkShift = require('../models/WorkShift');
const router = Router();
const config = require('config');
const getDate = require('../utils/functions');

router.post('/daily', auth, async (req, res) => {

    const {companyId, yearAndMonth} = req.body;

    WorkShift.findAll({where: {CompanyId: companyId}})
    .then(workShifts => workShifts.filter(w => w.date.startsWith(yearAndMonth)))
    .then(async filteredShifts => {

        const data = {};
        for (const shift of filteredShifts) {
            
            const day = shift.date.split('-')[2];
            const reports = await shift.getReports();
            const revenue = parseFloat(shift.revenue);
            let costAmount = 0;

            for (const report of reports) {
                const product = await report.getProduct();
                costAmount += product.costPrice * report.quantity;
            }
            data[day] = {revenue, profit: revenue - costAmount, receipts: shift.receipts };
        }

        const revenueArr = [];
        const profitArr = [];
        const receiptArr = [];
        Object.values(data).forEach(item => {
            revenueArr.push(item.revenue);
            profitArr.push(item.profit);
            receiptArr.push(item.receipts);
        });
        res.json({labels: Object.keys(data), revenueArr, profitArr, receiptArr});
    })
    .catch(() => {
        return res.status(400).json({message: config.get('unknownErrorMessage')});
    });
});

module.exports = router;