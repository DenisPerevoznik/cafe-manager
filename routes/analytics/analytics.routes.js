const { Router } = require('express');
const auth = require('../../middleware/auth.middleware');
const WorkShift = require('../../models/WorkShift');
const router = Router();
const config = require('config');
const getDate = require('../../utils/functions');
const { check, validationResult } = require('express-validator');
const colors = require('colors');
const {
  generateDataByShifts,
  getDailyChartData,
  getMonthlyChartData,
} = require('./functions');
const Expense = require('../../models/Expense');

router.post('/now', auth, (req, res) => {
  const { companyId } = req.body;
  const nowDate = `${getDate().year}-${getDate().month}-${getDate().day}`;
  WorkShift.findAll({ where: { CompanyId: companyId, date: nowDate } })
    .then(async (workShifts) => {
      let revenueSum = 0;
      let receipts = 0;
      let costAmount = 0;
      for (const shift of workShifts) {
        revenueSum += parseFloat(shift.revenue);
        receipts += shift.receipts;
        const reports = await shift.getReports();

        for (const report of reports) {
          const product = await report.getProduct();
          costAmount += product.costPrice * report.quantity;
        }
      }

      const data = {
        revenue: revenueSum,
        profit: revenueSum - costAmount,
        receipts,
      };

      const percentage = await getPercentage(data, companyId);

      res.json({
        revenue: {value: data.revenue, percent: percentage.revenue},
        profit: {value: data.profit, percent: percentage.profit},
        receipts: {value: data.receipts, percent: percentage.receipts}
      });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: config.get('unknownErrorMessage'), error });
    });
});

async function getPercentage(data, companyId){
  
  const shifts = await WorkShift.findAll({
    limit: 2,
    where: {CompanyId: companyId},
    order: [[ 'createdAt', 'DESC' ]]
  });

  let percentage = {
    revenue: 0, profit: 0, receipts: 0
  };
  if(shifts.length > 1){

    const previousShift = shifts[1];
    let costAmount = 0;

    const lastRevenueSum = parseFloat(previousShift.revenue);
    const lastReceipts = previousShift.receipts;
    const reports = await previousShift.getReports();

    for (const report of reports) {
      const product = await report.getProduct();
      costAmount += product.costPrice * report.quantity;
    }
    const lastProfit = lastRevenueSum - costAmount;

    percentage.profit = (data.profit / lastProfit - 1) * 100;
    percentage.revenue = (data.revenue / lastRevenueSum - 1) * 100;
    percentage.receipts = (data.receipts / lastReceipts - 1) * 100;
  }

  return percentage;
}

router.post('/finance', auth, (req, res) => {
  res.json({ data: 0 });
});

router.post(
  '/daily',
  [
    auth,
    check('yearAndMonth', 'Значение "yearAndMonth" должно быть строкой')
      .isString()
      .isLength({ min: 6, max: 7 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { companyId, yearAndMonth } = req.body;
      WorkShift.findAll({ where: { CompanyId: companyId } })
        .then((workShifts) =>
          workShifts.filter((w) => w.date.startsWith(yearAndMonth))
        )
        .then(async (filteredShifts) => {
          res.json(
            getDailyChartData(await generateDataByShifts(filteredShifts, 'day'))
          );
        });
    } catch (error) {
      res.status(400).json({ message: config.get('unknownErrorMessage') });
    }
  }
);

router.post(
  '/monthly',
  [
    auth,
    check('year', 'Значение "year" должно быть четырехзначным числом').isInt({
      min: 2020,
      max: 3000,
    }),
  ],
  async (req, res) => {
    try {
      const { companyId, year } = req.body;
      WorkShift.findAll({ where: { CompanyId: companyId } })
        .then((workShifts) => workShifts.filter((w) => w.date.startsWith(year)))
        .then(async (filteredShifts) => {
          res.json(
            getMonthlyChartData(
              await generateDataByShifts(filteredShifts, 'month')
            )
          );
        });
    } catch (error) {
      res.status(400).json({ message: config.get('unknownErrorMessage') });
    }
  }
);

module.exports = router;
