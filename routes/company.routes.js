const { Router } = require('express');
const router = Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Company = require('../models/Company');
const User = require('../models/User');

router.get('/', auth, (req, res) => {
  const userId = req.user.userId;

  User.findByPk(userId)
    .then(async (user) => {
      if(!user){
        return res.status(401).json({message: "Повторите вход в аккаунт"});
      }
      const companies = (await user.getCompanies()) || [];
      return res.json({ companies });
    })
    .catch((error) => {
      return res.status(400).json({ message: error.message });
    });
});

router.post(
  '/create',
  [
    auth,
    check('name', 'Поле с именем компании обязательно к заполнению'),
    check('address', 'Поле с адресом компании обязательно к заполнению')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const userId = req.user.userId;
    User.findByPk(userId)
      .then(async (user) => {
        if (!user) {
          return res.status(400).json({ message: 'Пользователь не найден' });
        }

        user.createCompany(req.body)
          .then((company) => {
            return res.json({
              company,
              message: 'Новая компания успешно создана!',
            });
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ message: 'Ошибка создания компании: ' + err.message });
          });
      })
      .catch((err) => {
        return res.status(400).json({ message: err.message });
      });
  }
);

router.put('/edit/:id', [
  auth,
  check('companyName', 'Название компании не может быть пустым').not().isEmpty()
], async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const companyId = req.params.id;
  const {companyName, terminalAccount} = req.body;
  Company.update({name: companyName, mainAccount: terminalAccount}, {where: {id: companyId}})
  .then(() => {
    res.status(200).json({ message: 'Данные Вашего заведения успешно обновлены' });
  })
  .catch((err) => {
    return res.status(400).json({ message: err.message });
  });
});

router.delete('/remove/:id', auth, (req, res) => {
  const id = req.params.id;
  Company.destroy({ where: {id} }).then((company) => {
    res.json({message: `Компания ${company.name} удалена`});
  })
  .catch((err) => {
    return res.status(400).json({ message: err.message });
  });
});

module.exports = router;
