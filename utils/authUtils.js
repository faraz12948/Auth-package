const jwt = require('jsonwebtoken');
const { getUserFromEmail } = require('../repositories/user');

const { ACCESS_TOKEN_SECRET } = process.env;
const generateToken = (username, email) => {
    let data = {
        username,
        email
    }
    return jwt.sign(data, 'ffffff', {
        expiresIn: '60d'
    })
}
async function verifyToken(req, ACCESS_TOKEN_SECRET) {
    let token;

    if (checkAuthHeader(req)) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            return { token, decoded };
        } catch (e) {
            console.error(e);
            throw new Error(e.message || 'Authorization failed');
        }
    }
    throw new Error('not authorized');
}
async function verfiyTokenDate(token) {
    const decodedToken = jwt.verify(token, 'ffffff');

    if (decodedToken.exp < Date.now() / 1000) {
        // check if the token has expired
        return false;
    } else {
        return true;
    }
}

function checkAuthHeader(req) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return true;

    }
    return false;
}
async function verifyJwtuser(req, ACCESS_TOKEN_SECRET) {

    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET)

    const users = await getUserFromEmail(decoded.email);
    if (users.rows.length) {

        req.user = users.rows[0];
        return true;

    }
    return false;

}

module.exports = {

    generateToken,
    verifyJwtuser,
    checkAuthHeader,
    verfiyTokenDate,
    verifyToken

}

