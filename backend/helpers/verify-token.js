const getToken = require('./get_token');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Acesso negado!' });
    }

    const token = getToken(req);


    if (!token) {
        return res.status(401).json({ message: 'Acesso negado!' });
    }

    try {
        const decoded = jwt.verify(token, `${process.env.SECRET_JWT}`);
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Token Inválido!' });
    }
};

module.exports = verifyToken;