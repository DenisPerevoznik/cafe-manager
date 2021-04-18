const { Router } = require('express');
const router = Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Ingredient = require('../models/Ingredient');
const Company = require('../models/Company');
const DeliveryIngredients = require('../models/Company');
const ProductIngredients = require('../models/Company');
const config = require('config');

router.get('/:companyId', auth, (req, res) => {
    const companyId = req.params.companyId;
    Ingredient.findAll({ where: { CompanyId: companyId } })
      .then(async (ingredients) => {

        res.json(await getCheckedIngredients(ingredients));
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  });

  router.get('/get/:id', auth, (req, res) => {

    const id = req.params.id;
    Ingredient.findByPk(id)
    .then(async (ingredient) => {
      res.json({...ingredient, isUsing: await checkIsUsing()});
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  });

  router.post(
    '/create',
    [
      auth,
      check('title', 'Название обязательно к заполнению').not().isEmpty().isString(),
      check('unit', 'Единица измерения указана не верно').isString().custom(unit => {
        return unit === 'кг.' || unit === 'шт.' || unit === 'л.'
      })
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
  
      Company.findByPk(req.body.companyId)
        .then((company) => {
          company.createIngredient({ ...req.body }).then((ingredient) => {
            res.json({ ingredient, message: 'Новый ингредиент добавлен' });
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
      check('title', 'Название обязательно к заполнению').not().isEmpty().isString(),
      check('unit', 'Единица измерения указана не верно').isString().custom(unit => {
        return unit === 'кг.' || unit === 'шт.' || unit === 'л.'
      })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
  
    try {
  
      const ingredientId = req.params.id;
      Ingredient.update(req.body, { where: { id: ingredientId } })
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
      Ingredient.destroy({ where: {id} }).then(() => {
        res.json({message: `Ингредиент удален`});
      });
    }
  );

  async function checkIsUsing(ingredient){

    const foundInDeliveries = await ingredient.getDeliveries();
    const foundInProducts = await ingredient.getProducts();

    if((!!foundInDeliveries && foundInDeliveries.length) || (!!foundInProducts && foundInProducts.length)){
        return true;
    }

    return false;
  }

  async function getCheckedIngredients(ingredients){
    const array = [];
    for (const ing of ingredients) {
        const isUsing = await checkIsUsing(ing);
        array.push({...ing.dataValues, isUsing});
    }
    return await array;
  }

  module.exports = router;