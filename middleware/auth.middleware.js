const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {

    if(req.method === 'OPTIONS'){
        next();
    }

    try {
        
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'Нужна повторная авторизация'});
        }

        const decoded = jwt.verify(token, config.get('jwtSecretKey'));
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Нужна повторная авторизация'});
    }
}

module.exports = auth;