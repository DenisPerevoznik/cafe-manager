const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const Employee = require('../models/Employee');
const WorkShiftExpense = require('../models/WorkShiftExpense');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const Category = require('../models/Category');
const WorkShift = require('../models/WorkShift');
const Company = require('../models/Company');
const Account = require('../models/Account');
const ProductIngredients = require('../models/ProductIngredients');
const Report = require('../models/Report');

router.post(
  '/login-user', async (req, res) => {
    
  const {email, password} = req.body;

  const user = await User.findOne({ where: { email } });

      if (user) {
        const checkPass = await bcrypt.compare(password, user.password);

        if (checkPass) {
          const companies = await user.getCompanies();
          return res.status(200).json({cafes: companies, user});
        }
        else{
          return res.status(404).json({message: "Не верный логин или пароль"});
        }
      }
      else{
        return res.status(404).json({message: "Не верный логин или пароль"});
      }
  }
);

router.post('/sync', async(req, res) => {

  const {companyId, workShifts} = req.body;

  await synchronization(workShifts, companyId);

  const products = await Product.findAll({where: {published: 1, CompanyId: companyId}});
  const categories = await Category.findAll({where: {published: 1, CompanyId: companyId}});
  await Company.update({lastSync: new Date()}, {where: {id: companyId}});
  res.status(200).json({categories, products});
});

router.get('/get-employees/:companyId', (req, res) => {
  const companyId = req.params.companyId;
  Employee.findAll({ where: { CompanyId: companyId } })
    .then(employees => {
      res.status(200).json({employees});
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

async function synchronization(workShifts, companyId){

  try {
    if(!workShifts.length) return;

    const companyModel = await Company.findOne({where: {id: companyId}});
    for (const reqWorkShift of workShifts) {

      const workShiftModel = await WorkShift.findOne({where: {
        CompanyId: companyId,
        date: reqWorkShift.date,
        openingTime: reqWorkShift.openingTime
      }});

      const reqExpenses = reqWorkShift.expenses;
      const reqReports = reqWorkShift.reports;
      let workShiftId = 0;

      if(workShiftModel){ // if workshift existing in the db

        workShiftId = workShiftModel.dataValues.id;

        // expenses
        const shiftExpenses = await workShiftModel.getWorkShiftExpenses();

        if(shiftExpenses.length){
          for (const expense of shiftExpenses) {
            await WorkShiftExpense.destroy({where: {id: expense.dataValues.id}})
          }
        }

        const updateWorkShift = {};
        if(workShiftModel.dataValues.status == true && reqWorkShift.status == false){

          updateWorkShift.closingTime = reqWorkShift.closingTime;
          updateWorkShift.closingBalance = reqWorkShift.closingBalance;
          updateWorkShift.collection = reqWorkShift.collection;
          updateWorkShift.status = false;
        }

        updateWorkShift.receipts = reqWorkShift.receipts;
        updateWorkShift.revenue = reqWorkShift.revenue;
        await WorkShift.update(updateWorkShift, {where: {id: workShiftId}});
      }
      else{ // иначе если смены не существует в базе и ее нужно создать

        const createdWorkShift = await companyModel.createWorkShift(reqWorkShift);
        workShiftId = createdWorkShift.dataValues.id;
      }

      console.log('EXPENSES: '.red, reqExpenses);
      for (const expense of reqExpenses) {
        expense.WorkshiftId = workShiftId;
        await companyModel.createWorkShiftExpense({comment: expense.comment, sum: expense.sum, WorkShiftId: expense.WorkshiftId});
      }

      await processingOfIngredientsAndReports(reqReports, workShiftId, companyModel);
    }

    WorkShift.findAll({
      limit: 1,
      where: {CompanyId: companyId},
      order: [ [ 'createdAt', 'DESC' ]]
    })
    .then(async (shifts) => {

      const lastWorkShiftModel = shifts[0];
      let mainAccountBalance = 0;

      if(mainAccountModel && lastWorkShiftModel){

        if(lastWorkShiftModel.dataValues.status == true){// если смена открыта, то баланс счета принимает сумму собранную на смене
          mainAccountBalance = parseFloat(lastWorkShiftModel.dataValues.revenue) + parseFloat(lastWorkShiftModel.dataValues.openingBalance);
        }
        else{ // иначе, если смена закрыта, то в кассе лежат деньги оставленные на след. день
          mainAccountBalance = parseFloat(lastWorkShiftModel.dataValues.closingBalance);
        }

        const accountModel = await companyModel.getMainAccount();
        await Account.update({balance: mainAccountBalance}, {where: {id: accountModel.dataValues.id}});
      }
    });
  } catch (error) {
    console.log('SYNC error: '.red, error);
  }
}

async function processingOfIngredientsAndReports(reqReports, workShiftId, companyModel){

  for (const reqReport of reqReports) {
    
    const productModel = await Product.findByPk(reqReport.ProductId);
    const ingredients = await productModel.getIngredients();

    for (const ingredientModel of ingredients) {
      
      const usingInOne = ingredientModel['product_ingredients'].usingInOne;
      const updatedQuantity = ingredientModel['product_ingredients'].quantity - (reqReport.quantity * usingInOne);

      await ProductIngredients.update({quantity: updatedQuantity}, {where: {id: ingredientModel.dataValues.id}});
    }

    const splittedDate = reqReport.date.split('.');
    const date = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
    const reportModel = await Report.findOne({where: {WorkShiftId: workShiftId, date, ProductId: reqReport.ProductId}});

    if(reportModel){
      // выполняем слияние
      const quantity = parseFloat(reportModel.dataValues.quantity) + reqReport.quantity;
      const total = parseFloat(reportModel.dataValues.total) + reqReport.total;

      await Report.update({quantity, total}, {where: {id: reportModel.dataValues.id}});
    }
    else{
      // создаем новый объект отчета
      await companyModel.createReport({...reqReport, WorkShiftId: workShiftId, date});
    }
  }
}

module.exports = router;
