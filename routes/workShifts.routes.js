const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const config = require('config');
const WorkShift = require('../models/WorkShift');
const getDate = require('../utils/functions');
const router = Router();

router.get('/:companyId', auth, (req, res) => {
  const { companyId } = req.params;

  WorkShift.findAll({ where: { CompanyId: companyId } })
    .then(async (shifts) => {
      res.json({ workShifts: await generateResponseData(shifts) });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

router.post('/remove', auth, async (req, res) => {
  try {
    const { removeIds } = req.body;

    for (const id of removeIds) {
      await WorkShift.destroy({ where: { id } });
    }
    res.json({ message: 'Выбранные рабочие смены удалены' });
  } catch (error) {
    res.status(400).json({ message: config.get('unknownErrorMessage') });
  }
});

async function getSales(shift) {
  const sales = [];
  const reports = await shift.getReports();
  for (const report of reports) {
    const product = await report.getProduct();
    sales.push({
      productName: product.title,
      unitPrice: product.price,
      numberOfSales: report.quantity,
      revenue: report.total,
    });
  }

  return sales;
}

async function generateResponseData(shifts) {
  const responseData = [];
  for (const shift of shifts) {
    const emp = await shift.getEmployee();

    responseData.push({
      ...shift.dataValues,
      date: getDate(shift.date).stringFullDate,
      employeeName: emp.name,
      openingTime: shift.openingTime.substr(0, 5),
      closingTime: shift.closingTime ? shift.closingTime.substr(0, 5) : null,
      sales: await getSales(shift),
    });
  }
  return responseData.reverse();
}

module.exports = router;
