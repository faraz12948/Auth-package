const express = require('express')
const globalVars = require('./globalVars');
const { login, register } = require('./controllers/user');
const router = express.Router();
const AuthMiddleware = require('./middlewares/auth');
const dotenv = require('dotenv');
const pool_p = require('./config/dbConfig')


function Auth(pool, accessTokenSecret, email, appPassword) {
    const app = express();

    // Define middleware to add a variable to every request
    // app.use(function (req, res, next) {
    //     res.locals.db_pool = pool;
    //     res.locals.accessTokenSecret = accessTokenSecret;
    //     res.locals.service_email = email;
    //     res.locals.appPassword = appPassword;
    //     next();
    // });

    // setting the global values
    globalVars.setPool(pool);
    globalVars.setAccessTokenSecret(accessTokenSecret);
    globalVars.setEmail(email);
    globalVars.setAppPassword(appPassword);


    const cors = require('cors');
    const cookieParser = require('cookie-parser');
    dotenv.config();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(router);





    const AuthMiddlewareObject = new AuthMiddleware();

    router.get('/auth-t1', async function (req, res) {
        try {

            const data = await pool.query('SELECT * FROM users');
            res.status(200).json({
                "message": "OK",
                "data": data.rows
            })
        } catch (e) {
            res.json(e)
        }
    })
    router.post('/auth-t1/login', async (req, res) => {

        await login(req, res)

    })
    router.post('/auth-t1/signin', async (req, res) => {

        await register(req, res)

    })

    router.route('/auth-t1/protected').get([AuthMiddlewareObject.authorizedUser, AuthMiddlewareObject.authorizedUserdb], async (req, res) => {
        res.status(200).json({
            "data": "secret"
        })
    })




    return {
        "authApp": app,
        "AuthMiddleware": AuthMiddlewareObject
    };



}

module.exports = Auth;
