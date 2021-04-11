const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Account = require('../models/Account');
const router = Router();
const config = require('config');
const Company = require('../models/Company');

router.get('/:companyId', auth, (req, res) => {
  const companyId = req.params.companyId;
  Account.findAll({ where: { CompanyId: companyId } })
    .then((accounts) => {
      res.json({ accounts, accountsTypes: config.get('accountsTypes') });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

router.post(
  '/create',
  [
    auth,
    check('title', 'Название ячейки обязательно к заполнению').not().isEmpty(),
    check('balance', 'Нужно указать начальный баланс')
      .not()
      .isEmpty()
      .isFloat()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    Company.findByPk(req.body.companyId)
      .then((company) => {
        company.createAccount({ ...req.body }).then((account) => {
          res.json({ account, message: 'Новая ячейка создана' });
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: 'Ошибка создания ячейки: ' + err.message });
      });
  }
);

router.delete('/remove/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    await Account.destroy({ where: { id } });
    res.json({ message: 'Денежная ячейка успешно удалена' });
  } catch (error) {
    res.status(400).json({ message: config.get('unknownErrorMessage') });
  }
});

router.put('/update-balance', 
[
auth, check('balance', 'Нужно указать начальный баланс')
.not()
.isEmpty()
.isFloat()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  
  const { balance, accountId } = req.body;
    Account.update({ balance }, { where: { id: accountId } })
      .then(() => {
        res.json({ message: 'Баланс пополнен' });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
})

router.put(
  '/update',
  [
    auth,
    check('title', 'Поле с названием обязательно к заполнению')
      .not()
      .isEmpty()
      .isString(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, accountId } = req.body;
    Account.update({ title }, { where: { id: accountId } })
      .then(() => {
        res.json({ message: 'Имя ячейки успешно изменено' });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  }
);

module.exports = router;
