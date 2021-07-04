const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth.middleware');

router.post(
  '/signup',
  [
    check('email', 'Некорректно введен email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, surname, email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (user) {
        return res
          .status(400)
          .json({ message: 'Пользователь с таким email уже существует!' });
      }

      const secretPass = await bcrypt.hash(password, 15);
      User.create({ name, surname, email, password: secretPass })
        .then((user) => {
          const token = createToken(user.id);
          res.status(200).json({
            token,
            userId: user.id,
            message: 'Пользователь успешно создан',
          });
        })
        .catch((error) => {
          res.status(400).json({
            message: `Ошибка создания пользователя: ${error.message}`,
          });
        });
    } catch (error) {
      res.status(400).json({ message: config.get('unknownErrorMessage') });
    }
  }
);

router.post(
  '/signin',
  [
    check('email', 'Не корректно введен email').isEmail(),
    check('password', 'Поле с паролем не может быть пустым').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (user) {
        const checkPass = await bcrypt.compare(password, user.password);

        if (checkPass) {
          const token = createToken(user.id);
          return res.json({ token, userId: user.id });
        }
      }

      res.status(400).json({ message: 'Не верный email или пароль' });
    } catch (error) {
      res.status(400).json({ message: config.get('unknownErrorMessage') });
    }
  }
);

router.get('/current-user', auth, async(req, res) => {

  const userId = req.user.userId;
  const user = await User.findByPk(userId);

  if (user)
    return res.status(200).json({name: user.dataValues.name, surname: user.dataValues.surname, email: user.dataValues.email});

  res.status(401).json({message: "Нужна повторная авторизация"});
});

router.get('/check', auth, (req, res) => {
  res.status(200).json({ message: 'Авторизация выполнена' });
});

function createToken(userId) {
  return jwt.sign({ userId }, config.get('jwtSecretKey'), {
    expiresIn: '2 days',
  });
}

module.exports = router;
