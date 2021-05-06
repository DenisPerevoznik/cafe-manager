const { Router } = require('express');
const router = Router();
const { validationResult, check, body } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Delivery = require('../models/Delivery');
const Company = require('../models/Company');
const Ingredient = require('../models/Ingredient');

router.get('/:companyId', auth, (req, res) => {
    const companyId = req.params.companyId;
    Delivery.findAll({ where: { CompanyId: companyId } })
      .then(async (deliveries) => {

        res.json(await getResponseDeliveries(deliveries));
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  });

  router.get('/get/:id', auth, (req, res) => {

    const id = req.params.id;
    Delivery.findByPk(id)
    .then(async (delivery) => {
      res.json(await getResponseDeliveries(delivery));
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  });

  router.post(
    '/create',
    [
      auth,
      check('companyId', 'companyId = null').not().isEmpty(),
      check('delivery.SupplierId', 'supplierId = null').not().isEmpty(),
      check('delivery.AccountId', 'accountId = null').not().isEmpty()
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
  
      const delivery = req.body.delivery;
      const ingredients = req.body.ingredients;

      Company.findByPk(req.body.companyId)
        .then((company) => {
          company.createDelivery(delivery).then(async (delivery) => {
            
            try {
                await attachIngredients(delivery, ingredients, req.body.companyId);
                await processingOfIngredients(ingredients);
                await processingOfAccount(delivery);

                return res.json({message: "Информация о поставке успешно добавлена"});
            } catch (error) {
                return res.status(400)
                  .json({ message: 'Ошибка при создании: ' + error.message });
            }
          });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ message: 'Ошибка при создании: ' + err.message });
        });
    }
  );

  async function processingOfIngredients(requestIngredients){

    for (const ingredient of requestIngredients) {
      const ingredientModel = await Ingredient.findByPk(ingredient.id);
      const quantity = parseFloat(ingredientModel.dataValues.quantity) + parseFloat(ingredient.quantity);
      await ingredientModel.update({quantity, price: ingredient.unitPrice});
    }
  }

  async function processingOfAccount(deliveryModel){
    const account = await deliveryModel.getAccount();
    const balance = account.dataValues.balance - deliveryModel.dataValues.sum;
    await account.update({balance});
  }

  async function attachIngredients(delivery, reqIngredients, CompanyId){
    for (const ing of reqIngredients) {
      const ingredientModel = await Ingredient.findByPk(ing.id);
      await delivery.addIngredient(ingredientModel, {through: {
          quantity: ing.quantity,
          sum: ing.sum,
          CompanyId
      }});
    }
  }

  async function detachIngredients(delivery){
    const ingredients = await delivery.getIngredients();
    for (const ingredient of ingredients) {
      await ingredient['delivery_ingredients'].destroy();
    }
  }
  
  router.delete('/remove/:id', auth, async (req, res) => {
    const id = req.params.id;

    const delivery = await Delivery.findByPk(id);
    if(!!delivery){
      await detachIngredients(delivery);
    }
    Delivery.destroy({ where: {id} }).then(() => {
      res.json({message: `Информация о поставке удалена`});
    });
  }
);

  async function getResponseDeliveries(deliveries){

    if(deliveries instanceof Array){
        const readyArray = [];
        for (const delivery of deliveries) {
          await getReadyDelivery(delivery)
          .then(newDelivery => {
            readyArray.push(newDelivery);
          });
        }

        return readyArray;
    }
    let deliveryData;
    await getReadyDelivery(deliveries)
    .then(newDelivery => {
        deliveryData = newDelivery;
    });

    return deliveryData;
  }

  async function getReadyDelivery(delivery){
    return await delivery.getIngredients()
    .then(async (ingredients) => {
      const ingredientsArray = [];
      for (const ingredient of ingredients) {
        const quantity = parseFloat(await ingredient['delivery_ingredients'].quantity);
        const sum = parseFloat(await ingredient['delivery_ingredients'].sum);
        ingredient.dataValues.price = parseFloat(ingredient.dataValues.price);
        ingredientsArray.push({...ingredient.dataValues, quantity, sum});
      }

      return ingredientsArray;
    })
    .then(async (ingredients) => {
      const account = await delivery.getAccount();
      const supplier = await delivery.getSupplier();
      return {...delivery.dataValues, ingredients, 
        account: account ? account : {title: '(этот счет был удален)'}, 
        supplier: supplier ? supplier : {name: '(этот поставщик был удален)'}};
    })
  }

  module.exports = router;