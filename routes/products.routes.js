const { Router } = require('express');
const router = Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Product = require('../models/Product');
const Company = require('../models/Company');
const DeliveryProducts = require('../models/Company');
const ProductProducts = require('../models/Company');
const config = require('config');

router.get('/:companyId', auth, (req, res) => {
    const companyId = req.params.companyId;
    Product.findAll({ where: { CompanyId: companyId } })
      .then(async (products) => {

        res.json(await getResponseProducts(products));
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  });

  router.get('/get/:id', auth, (req, res) => {

    const id = req.params.id;
    Product.findByPk(id)
    .then(async (product) => {
      res.json({...product, isUsing: await getResponseProducts(product)});
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
          company.createProduct({ ...req.body }).then((product) => {
            res.json({ product, message: 'Новый ингредиент добавлен' });
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
  
      const productId = req.params.id;
      Product.update(req.body, { where: { id: productId } })
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
      Product.destroy({ where: {id} }).then(() => {
        res.json({message: `Ингредиент удален`});
      });
    }
  );

  async function getResponseProducts(products){

    console.log(`products:`.red, products);
    if(products instanceof Array){
        const readyArray = [];
        for (const product of products) {
            const ingredients = await product.getIngredients();
            const category = await product.getCategory();
            readyArray.push({...product.dataValues, ingredients, category});
        }

        return readyArray;
    }
    else{
        const ingredients = await products.getIngredients();
        const category = await products.getCategory();
        return {...products.dataValues, ingredients, category}
    }
  }

  module.exports = router;