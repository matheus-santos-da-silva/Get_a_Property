const jwt = require('jsonwebtoken');

const createUserToken = (user, req, res) => {

    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, `${process.env.SECRET_JWT}`);

    res.status(200).json({
        message: 'Você está autenticado!',
        token: token,
        userId: user.id
    });

};

module.exports = createUserToken;