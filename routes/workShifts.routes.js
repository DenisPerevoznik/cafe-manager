const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const config = require('config');
const WorkShift = require('../models/WorkShift');
const router = Router();

router.get('/:companyId', auth, (req, res) => {

    const {companyId} = req.params;

    WorkShift.findAll({where: {CompanyId: companyId}})
    .then(async shifts => {

        const responseData = [];
        for (const shift of shifts) {
            
            const emp = await shift.getEmployee();
            responseData.push({...shift.dataValues, employeeName: emp.name});
        }
        res.json({workShifts: responseData.reverse()});
    })
    .catch(error => {
        res.status(400).json({message: error.message});
    });
});

router.post('/remove', auth, async (req, res) => {

    try {
        const {removeIds} = req.body;
    
        for (const id of removeIds) {
            await WorkShift.destroy({where: {id}});
        }
        res.json({message: 'Выбранные рабочие смены удалены'});
    } catch (error) {
        res.status(400).json({message: config.get('unknownErrorMessage')});
    }
});

module.exports = router;