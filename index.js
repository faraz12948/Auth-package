const express = require('express')
const { login, register } = require('./controllers/user');
const router = express.Router();
const AuthMiddleware = require('./middlewares/auth');
const dotenv = require('dotenv');
const pool_p = require('./config/dbConfig')


function Auth(pool, accessTokenSecret, email, appPassword) {
    const app = express();

    // Define middleware to add a variable to every request
    app.use(function (req, res, next) {
        res.locals.db_pool = pool;
        res.locals.accessTokenSecret = accessTokenSecret;
        res.locals.service_email = email;
        res.locals.appPassword = appPassword;
        next();
    });


    const cors = require('cors');
    const cookieParser = require('cookie-parser');
    dotenv.config();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(router);


   


    const AuthMiddlewareObject = new AuthMiddleware(accessTokenSecret, email, appPassword, pool_p);

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

        await login(req, res, pool)

    })
    router.post('/auth-t1/signin', async (req, res) => {

        await register(req, res, pool)

    })

    router.route('/auth-t1/protected').get([AuthMiddlewareObject.authorizedUser, AuthMiddlewareObject.authorizedUserdb], async (req, res) => {
        res.status(200).json({
            "data": "secret"
        })
    })


    app.listen(5000, () => {
        console.log(`Example app listening on port ${5000}`)
    })

    return {
        "app": app,
        "AuthMiddleware": AuthMiddlewareObject
    };



}
Auth(pool_p, "ffffff", "faraz.ahmed7397@gmail.com", "cscsdnsdvsdvk");

module.exports = Auth;
