const { Router } = require('express');
const router = Router();
const { validationResult, check, body } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Product = require('../models/Product');
const Company = require('../models/Company');
const DeliveryProducts = require('../models/Company');
const ProductProducts = require('../models/Company');
const config = require('config');
const Ingredient = require('../models/Ingredient');

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
      res.json(await getResponseProducts(product));
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  });

  router.post(
    '/create',
    [
      auth,
      check('product.title', 'Название обязательно к заполнению').not().isEmpty().isString(),
      check('product.price', 'Вы не указалаи цену').isFloat(),
      check('companyId', 'companyId = null').not().isEmpty()
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
  
      const product = req.body.product;
      const ingredients = req.body.ingredients;

      Company.findByPk(req.body.companyId)
        .then((company) => {
          company.createProduct(product).then(async (product) => {
            
            if(!product.isPurchased){

                try {
                    await attachIngredients(product, ingredients, req.body.companyId);

                    return res.json({message: "Тех карта успешно создана"});
                } catch (error) {
                    return res.status(400)
                        .json({ message: 'Ошибка при создании: ' + error.message });
                }
            }
            res.json({ product, message: 'Продукт успешно добавлен' });
          });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ message: 'Ошибка при создании: ' + err.message });
        });
    }
  );

  async function attachIngredients(product, reqIngredients, CompanyId){
    for (const ing of reqIngredients) {
      const ingredientModel = await Ingredient.findByPk(ing.id);
      await product.addIngredient(ingredientModel, {through: {
          usingInOne: ing.usingInOne,
          CompanyId
      }});
    }
  }

  async function detachIngredients(product){
    const ingredients = await product.getIngredients();
    for (const ingredient of ingredients) {
      await ingredient['product_ingredients'].destroy();
    }
  }

  router.put('/update/:id', [
      auth,
      check('product.title', 'Название обязательно к заполнению').not().isEmpty().isString(),
      check('product.price', 'Вы не указалаи цену').isFloat(),
      check('companyId', 'companyId = null').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
  
    try {
  
      const id = req.params.id;
      const reqProduct = req.body.product;
      const reqIngredients = req.body.ingredients;
      const product = await Product.findByPk(id);

      Product.update(reqProduct, { where: {id} })
        .then(async (productResponse) => {
          await detachIngredients(product);
          await attachIngredients(product, reqIngredients, req.body.companyId);
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
  
  router.delete('/remove/:id', auth, async (req, res) => {
    const id = req.params.id;

    const product = await Product.findByPk(id);
    if(!!product){
      await detachIngredients(product);
    }
    Product.destroy({ where: {id} }).then(() => {
      res.json({message: `Продукт удален`});
    });
  }
);

  async function getResponseProducts(products){

    if(products instanceof Array){
        const readyArray = [];
        for (const product of products) {
          await getReadyProduct(product)
          .then(newProduct => {
            readyArray.push(newProduct);
          });
        }

        return readyArray;
    }
    let productData;
    await getReadyProduct(products)
    .then(newProduct => {
      productData = newProduct;
    });

    return productData;
  }

  async function getReadyProduct(product){
    return await product.getIngredients()
    .then(async (ingredients) => {
      const ingredientsArray = [];
      for (const ingredient of ingredients) {
        const usingInOne = parseFloat(await ingredient['product_ingredients'].usingInOne);
        ingredient.dataValues.price = parseFloat(ingredient.dataValues.price);
        ingredientsArray.push({...ingredient.dataValues, usingInOne});
      }

      return ingredientsArray;
    })
    .then(async (ingredients) => {
      const category = await product.getCategory();
      return {...product.dataValues, ingredients, category};
    })
  }

  module.exports = router;