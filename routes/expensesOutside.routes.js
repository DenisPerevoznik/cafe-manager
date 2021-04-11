const { Router } = require('express');
const router = Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Expense = require('../models/Expense');
const Account = require('../models/Account');
const Company = require('../models/Company');
const config = require('config');
const getDate = require('../utils/functions');

function getValidParams(isUpdate = false) {
  return [
    auth,
    check(
      `${isUpdate ? 'newExpense.' : ''}description`,
      'Описание к расходу обязательно к заполнению'
    )
      .not()
      .isEmpty()
      .isString(),
    check(
      `${isUpdate ? 'newExpense.' : ''}expenseAmount`,
      'Сумма расхода должна быть указана и являться положительным числом'
    )
      .not()
      .isEmpty()
      .isFloat({ min: 0 }),
    check(
      `${isUpdate ? 'newExpense.' : ''}AccountId`,
      'Нужно указать счет для списания средств'
    ).custom((value) => value !== 0),
  ];
}

router.get('/:companyId', auth, (req, res) => {
  const companyId = req.params.companyId;
  Expense.findAll({ where: { CompanyId: companyId } })
    .then(async (expenses) => {
      res.json({ expenses: await generateResponseData(expenses) });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

router.post('/create', getValidParams(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { expenseAmount, AccountId } = req.body;

  Expense.create({ ...req.body })
    .then(() => {
      Account.findByPk(AccountId)
        .then((account) => {
          account.update({ balance: account.balance - expenseAmount });
        })
        .then(() => {
          res.json({ message: 'Запись расхода добавлена' });
        });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ message: 'Ошибка добавления записи: ' + err.message });
    });
});

router.put('/update', getValidParams(true), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { oldExpense, newExpense } = req.body;

    await invoiceProcessing(oldExpense, newExpense);
    // обновление самого расхода
    Expense.update(newExpense, { where: { id: oldExpense.id } })
      .then(() => {
        res.json({ message: 'Запись о расходе успешно обновлена!' });
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

router.post(
  '/remove',
  [
    auth,
    check('returnToCell', 'Обновите страницу и повторите попытку').isBoolean(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { returnToCell, expense } = req.body;

    Expense.destroy({ where: { id: expense.id } }).then(() => {
      if (returnToCell) {
        // если при удалении нужно вернутьсумму расхода в ячейку
        Account.findByPk(expense.AccountId).then((account) => {
          account.update({
            balance: parseFloat(account.balance) + expense.expenseAmount,
          });
        });
      }

      res.json({
        message: `Запись о расходе удалена. ${
          returnToCell ? 'Сумма расхода возвращена!' : ''
        }`,
      });
    });
  }
);

async function generateResponseData(expenses) {
  const responseData = [];
  for (const expense of expenses) {
    responseData.push({
      ...expense.dataValues,
      // accountTitle: (await expense.getAccount()).title,
      expenseAmount: parseFloat(expense.expenseAmount),
      createdAt: getDate(expense.createdAt).stringFullDate,
      updatedAt: getDate(expense.updatedAt).stringFullDate,
    });
  }
  return responseData;
}

async function invoiceProcessing(oldExpense, newExpense) {
  const oldAmount = oldExpense.expenseAmount;
  const newAmount = newExpense.expenseAmount;
  const dbOldExpOutside = await Account.findByPk(oldExpense.AccountId);
  const dbNewExpOutside = await Account.findByPk(newExpense.AccountId);
  const dbNewExpBalance = parseFloat(dbNewExpOutside.balance);
  const dbOldExpBalance = parseFloat(dbOldExpOutside.balance);

  if (
    newExpense.AccountId === oldExpense.AccountId &&
    newAmount !== oldAmount
  ) {
    // если выбранный счет не изменился, а сумма изменилась
    await dbNewExpOutside.update({
      balance:
        newAmount > oldAmount
          ? dbNewExpBalance - (newAmount - oldAmount)
          : dbNewExpBalance + (oldAmount - newAmount),
    });
  } else if (newExpense.AccountId !== oldExpense.AccountId) {
    // если изменилась и сумма и счет
    await dbOldExpOutside.update({
      balance: dbOldExpBalance + oldAmount,
    }); // возвращаем туда сумму

    await dbNewExpOutside.update({
      balance:
        dbNewExpBalance - (newAmount === oldAmount ? oldAmount : newAmount),
    });
    // отнимаем новую сумму с нового счета
  }
}

module.exports = router;
