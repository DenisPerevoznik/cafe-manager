const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const Report = require('../models/Report');
const router = Router();

router.post('/daily', auth, (req, res) => {

    /** ЭТОТ РОУТЕР В РАЗРАБОТКЕ */
    const {companyId} = req.body;

    Report.findAll({where: {CompanyId: companyId}})
    .then(reports => {
        res.json({reports});
    })
    .catch(error => {
        res.status(400).json({error});
    });
});

module.exports = router;