const { Router } = require('express');
const router = Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Category = require('../models/Category');
const Company = require('../models/Company');
const config = require('config');


router.get('/:companyId', auth, (req, res) => {
    const companyId = req.params.companyId;
    Category.findAll({ where: { CompanyId: companyId } })
      .then(categories => {
        res.json(categories);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  });

  router.get('/get/:id', auth, (req, res) => {

    const id = req.params.id;
    Category.findByPk(id)
    .then(category => {
      res.json(category);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  });

  router.post(
    '/create',
    [
      auth,
      check('title', 'Название обязательно к заполнению').not().isEmpty().isString()
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
  
      Company.findByPk(req.body.companyId)
        .then((company) => {
          company.createCategory({ ...req.body }).then((category) => {
            res.json({ category, message: 'Новая категория создана' });
          });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ message: 'Ошибка при создании: ' + err.message });
        });
    }
  );

  router.put('/update/:id', [auth, check('title', 'Название обязательно к заполнению').not().isEmpty().isString()], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
  
    try {
  
      const categoryId = req.params.id;
      Category.update(req.body, { where: { id: categoryId } })
        .then(() => {
          res.json({ message: 'Изменения сохранены' });
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
  
  router.delete('/remove/:id', auth, (req, res) => {

    const id = req.params.id;
      Category.destroy({ where: {id} }).then(() => {
        res.json({message: `Категория удалена`});
      });
    }
  );

  module.exports = router;