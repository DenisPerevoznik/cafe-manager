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
      const responseData = [];
      for (const shift of shifts) {
        const emp = await shift.getEmployee();
        const d = getDate(shift.date);
        responseData.push({
          ...shift.dataValues,
          date: `${d.day}.${d.month}.${d.year}`,
          employeeName: emp.name,
          openingTime: shift.openingTime.substr(0, 5),
          closingTime: shift.closingTime
            ? shift.closingTime.substr(0, 5)
            : null,
        });
      }
      res.json({ workShifts: responseData.reverse() });
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

module.exports = router;
