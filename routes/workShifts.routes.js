const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const WorkShift = require('../models/WorkShift');
const router = Router();

router.get('/:companyId', auth, (req, res) => {

    const {companyId} = req.params;

    WorkShift.findAll({where: {CompanyId: companyId}})
    .then(shifts => {
        res.json({workShifts: shifts});
    })
    .catch(error => {
        res.status(400).json({message: error.message});
    });
});

module.exports = router;