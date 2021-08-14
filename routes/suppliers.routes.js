const { Router } = require('express');
const router = Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Supplier = require('../models/Supplier');
const Company = require('../models/Company');
const config = require('config');

router.get('/:companyId', auth, (req, res) => {
    const companyId = req.params.companyId;
    Supplier.findAll({ where: { CompanyId: companyId } })
      .then(suppliers => {
        res.json(suppliers);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  });

  router.get('/get/:id', auth, (req, res) => {

    const id = req.params.id;
    Supplier.findByPk(id)
    .then(supplier => {
      res.json({...supplier.dataValues});
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  });

  router.post(
    '/create',
    [
      auth,
      check('name', 'Не указано имя поставщика').not().isEmpty().isString(),
      check('phone', 'Не указан номер телефона').not().isEmpty().isString(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
  
      Company.findByPk(req.body.companyId)
        .then((company) => {
          company.createSupplier(req.body).then((supplier) => {
            res.json({ supplier, message: 'Новый поставщик добавлен' });
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
      check('name', 'Не указано имя поставщика').not().isEmpty().isString(),
      check('phone', 'Не указан номер телефона').not().isEmpty().isString(),],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
  
    try {
  
      const supplierId = req.params.id;
      const supplier = await Supplier.findByPk(supplierId);
      Supplier.update(req.body, { where: { id: supplierId } })
        .then(() => {
          res.json({ message: `Изменения для поставщика "${supplier.dataValues.name}" сохранены` });
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
        const supplier = await Supplier.findByPk(id);
        Supplier.destroy({ where: {id} }).then(() => {
          res.json({message: `Поставщик "${supplier.dataValues.name}" удален`});
        });
    }
  );

  module.exports = router;