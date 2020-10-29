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

      res.json({
        revenue: revenueSum,
        profit: revenueSum - costAmount,
        receipts,
      });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: config.get('unknownErrorMessage'), error });
    });
});

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
      max: 2100,
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
