const {Router} = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');

router.post('/signup', 
[
    check('email', 'Некорректно введен email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6})
], async (req, res) => {

    try {
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg});
        }

        const {name, surname, email, password} = req.body;

        const user = await User.findOne({where: {email}})
        if(user){
            return res.status(400).json({message: 'Пользователь с таким email уже существует!'});
        }

        const secretPass = await bcrypt.hash(password, 15);
        User.create({name, surname, email, password: secretPass})
        .then(user => {
            res.status(200).json({user, message: 'Пользователь успешно создан'});
        })
        .catch(error => {res.status(400).json({message: `Ошибка создания пользователя: ${error.message}`})});
    } catch (error) {
        res.status(400).json({message: config.get('unknownErrorMessage')});
    }
});

router.post('/signin', 
[
    check('email', 'Не корректно введен email').isEmail(),
    check('password', 'Поле с паролем не может быть пустым').not().isEmpty()
], async (req, res) => {

    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg});
        }

        const {email, password} = req.body;

        const user = await User.findOne({where: {email}})
        
        if(user){
            const checkPass = await bcrypt.compare(password, user.password);
            
            if(checkPass){

                const token = jwt.sign({userId: user.id}, 
                    config.get('jwtSecretKey'), {expiresIn: '2 days'});
                
                return res.json({token, userId: user.id});
            }
        }

        res.status(400).json({message: 'Не верная почта или пароль'});
    } catch (error) {
        res.status(400).json({message: config.get('unknownErrorMessage')});
    }
});

module.exports = router;