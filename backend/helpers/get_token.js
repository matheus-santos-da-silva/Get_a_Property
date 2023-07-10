const getToken = (req) => {

    const headersAuth = req.headers.authorization;
    const token = headersAuth.split(' ')[1];

    return token;
};

module.exports = getToken;