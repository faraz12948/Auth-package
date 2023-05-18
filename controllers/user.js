const globalVars = require('../globalVars');
const { getTokenRepo, updateTokenRepo } = require("../repositories/user");
const { loginUser, getUserByEmail, getUserByUsername, registerUser } = require("../services/user");
const { verfiyTokenDate, generateToken } = require("../utils/authUtils");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    const { username, password } = req.body
    const users = await loginUser(username, password, globalVars.getPool());

    if (users.rows.length === 0) {

        res.status(404).json({
            message: 'User Not Found'
        })
        throw new Error('User Not Found')
    }
    let user = users.rows[0];
    if (await bcrypt.compare(password, user.password)) {
        let tkn = null;
        let pool = globalVars.getPool();
        let dbToken = await getTokenRepo({ username, pool });

        if (!verfiyTokenDate(dbToken.rows[0].token)) {
            tkn = generateToken(user.username, user.email);
            await updateTokenRepo({ username, tkn, pool });
        }
        tkn = dbToken.rows[0].token;

        res.cookie('jwt', tkn, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });
        return res.json({
            message: 'Login Successful',
            success: true,
            data: {
                username: user.username, email: user.email, token: tkn
            },
        })
    }
    res.status(401).json({
        message: 'Wrong Password'
    })
    throw new Error('Wrong Password')


}

const register = async (req, res) => {
    const {
        username,
        email,
        password,
        isAdmin
    } = req.body

    let pool = globalVars.getPool();
    let user = await getUserByEmail(email, pool);
    let uname = await getUserByUsername(username, pool);
    if (user.rows.length !== 0) {

        return res.status(409).json({
            message: 'Email already exist'
        })
        // throw new Error('Email already exist')
    }
    if (uname.rows.length !== 0) {

        return res.status(409).json({
            message: 'Username already exist'
        })
        // throw new Error('Username already exist')
    }

    let tkn = generateToken(username, email);
    await registerUser(username, email, password, isAdmin, tkn, pool);
    res.json({
        message: 'Registered Successfully',
        success: true,
        data: {
            name: username, email, token: tkn
        },
    })
}

module.exports = { login, register }