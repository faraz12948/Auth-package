
const globalVars = require('../globalVars');
const { getTokenRepo, getUserFromEmail } = require("../repositories/user");
const { verfiyTokenDate, checkAuthHeader, verifyToken } = require("../utils/authUtils");


class AuthMiddleware {



    constructor() {

        this.createUserTable();

    }

    async authorizedUser(req, res, next) {

        const { token, decoded } = await verifyToken(req, globalVars.getAccessTokenSecret());
        if (checkAuthHeader(req)) {

            try {
                let decoded_email = decoded.email;

                let pool = globalVars.getPool();
                const users = await getUserFromEmail({ "email": decoded_email, pool });

                if (!users.rows.length) {
                    res.status(401)
                    throw new Error('Invalid Token')

                }
                req.user = users.rows[0]

                if (verfiyTokenDate(token)) {

                    next()
                }


            } catch (e) {
                console.error(e)
                res.status(401)
                throw new Error(e.message || 'Authorization failed')
            }
        }
        if (!token) {
            res.status(401)
            throw new Error('not authorized')
        }
    }


    async authorizedUserdb(req, res, next) {

        const { token, decoded } = await verifyToken(req, globalVars.getAccessTokenSecret());
        if (checkAuthHeader(req)) {
            try {
                let username = decoded.username;
                let pool = globalVars.getPool();
                let dbToken = await getTokenRepo({ username, pool });

                if (token !== dbToken.rows[0].token) {

                    res.status(401)
                    throw new Error('Invalid Token')

                }
                next()

            } catch (e) {
                console.error(e)
                res.status(401)
                throw new Error(e.message || 'Authorization failed')
            }
        }
        if (!token) {
            res.status(401)
            throw new Error('not authorized')
        }
    }
    async createUserTable() {
        try {
            let pool = globalVars.getPool();
            const client = await pool.connect();
            await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            is_admin boolean DEFAULT false,
            token VARCHAR(2000) NOT NULL,
            reset_token VARCHAR(500) NOT NULL
        

          );
        `);
            console.log('User table created successfully.');
            client.release();
        } catch (error) {
            console.error('Error creating user table:', error);
        }
    };
}

module.exports = AuthMiddleware;