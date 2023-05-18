
const globalVars = require('../globalVars');
const { checkAuthHeader, verifyToken } = require("../utils/authUtils");
class AuthMiddleware_test {


    constructor() {

        if (this.constructor === AuthMiddleware_test) {
            throw new Error('Cant instanciate abstract class');
        }

    }

    async authorizedUser_test(req, res, next) {

        const { token, decoded } = await verifyToken(req, globalVars.getAccessTokenSecret());
        if (checkAuthHeader(req)) {
            next();

        }
        if (!token) {
            res.status(401)
            throw new Error('not authorized')
        }
    }



}
module.exports = AuthMiddleware_test;