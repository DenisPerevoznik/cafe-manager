const { Router } = require('express');
const router = Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const config = require('config');

const colors = ['#ff5151', '#ffa951', '#3fd74a', '#51afff'];

router.get('/:companyId', auth, (req, res) => {
    const companyId = req.params.companyId;
    Employee.findAll({ where: { CompanyId: companyId } })
      .then(employees => {
        res.json(employees);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  });

  router.get('/get/:id', auth, (req, res) => {

    const id = req.params.id;
    Employee.findByPk(id)
    .then(employee => {
      res.json({...employee.dataValues});
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  });

  router.post(
    '/create',
    [
      auth,
      check('name', 'Не указано имя сотрудника').not().isEmpty().isString(),
      check('phone', 'Не указан номер телефона').not().isEmpty().isString(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
  
      const color = colors[Math.floor(0 + Math.random() * (colors.length - 0))];
      Company.findByPk(req.body.companyId)
        .then((company) => {
          company.createEmployee({ ...req.body, color }).then((employee) => {
            res.json({ employee, message: 'Новый сотрудник добавлен' });
          });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ message: 'Ошибка при создании: ' + err.message });
        });
    }
  );

  router.put('/update/:id', [
      auth,
      check('name', 'Не указано имя сотрудника').not().isEmpty().isString(),
      check('phone', 'Не указан номер телефона').not().isEmpty().isString(),],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
  
    try {
  
      const employeeId = req.params.id;
      const employee = await Employee.findByPk(employeeId);
      Employee.update(req.body, { where: { id: employeeId } })
        .then(() => {
          res.json({ message: `Изменения для ${employee.dataValues.name} сохранены` });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ message: 'Ошибка при обновлении: ' + err.message });
        });
    } catch (error) {
      res.status(400).json({
        message: config.get('unknownErrorMessage'),
        info: error.message,
      });
    }
  });
  
  router.delete('/remove/:id', auth, async (req, res) => {
        const id = req.params.id;
        const employee = await Employee.findByPk(id);
        Employee.destroy({ where: {id} }).then(() => {
          res.json({message: `Сотрудник ${employee.dataValues.name} удален`});
        });
    }
  );

  module.exports = router;