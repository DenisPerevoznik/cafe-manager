const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const Employee = require('../models/Employee');
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

module.exports = router;