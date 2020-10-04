const {Router} = require('express');
const router = Router();
const {validationResult, check} = require('express-validator');
const auth = require('../middleware/auth.middleware');
const User = require('../models/User');
const colors = require('colors');


router.get('/', auth, (req, res) => {

    const userId = req.user.userId;

    User.findByPk(userId)
        .then(async(user) => {

            const companies = await user.getCompanies() || [];
            return res.json({companies});
        })
        .catch(error => {
            return res.status(400).json({message: error.message});
        })
});

router.post('/create', [
    auth,
    check('name', 'Поле с именем компании обязательно к заполнению').not().isEmpty()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.array()[0].msg});
    }

    const userId = req.user.userId;
    const {name} = req.body;
    User.findByPk(userId)
    .then(user => {

        if(!user){
            return res.status(400).json({message: 'Пользователь не найден'});
        }

        user.createCompany({name})
        .then(async company => {

            const companies = await user.getCompanies();
            return res.json(
            {
                createdCompany: company,
                companies,
                message: 'Новая компания успешно создана!'
            });
        })
        .catch(err => {
            return res.status(400).json({message: 'Ошибка создания компании: ' + err.message});
        });
    })
    .catch(err => {
        return res.status(400).json({message: err.message});
    });
});

module.exports = router;