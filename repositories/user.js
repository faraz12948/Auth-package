const bcrypt = require("bcrypt");


const loginRepo = async (data) => {
    const {
        username

    } = data
    const query = {
        text: 'SELECT username, email, password FROM users WHERE username = $1',
        values: [username]
    };
    const users = await data.pool.query(query);

    return users;

}
const updateTokenRepo = async (data) => {

    const query = `UPDATE users SET token = '${data.tkn}' WHERE username='${data.username}' RETURNING token`;
    const user = await data.pool.query(query)
    return user;

}
const getTokenRepo = async (data) => {
    const query = `SELECT token FROM users WHERE username='${data.username}'`;
    const token = await data.pool.query(query);

    return token;
}
const getUserFromEmail = async (data) => {
    const query = `SELECT username,email FROM users WHERE email='${data.email}'`
    return await data.pool.query(query)
}
const getUserFromUsername = async (data) => {
    const query = `SELECT username,email FROM users WHERE username='${data}'`
    return await data.pool.query(query)
}
const registerRepo = async (data) => {
    const {
        username,
        email,
        password,
        isAdmin,
        tkn,
        pool
    } = data
    const salt = await bcrypt.genSalt(10)
    let encryptedPassword = await bcrypt.hash(password, salt)
    const userInfo = [username, email, encryptedPassword, isAdmin, tkn];
    const query = {
        text: `INSERT INTO users(
    username,
    email,
    password,
    is_admin,
    token
  ) VALUES($1, $2, $3, $4, $5) RETURNING id, email`,
        values: userInfo
    };
    const user = await pool.query(query)
    return user;

}
module.exports = {
    loginRepo,
    updateTokenRepo,
    getTokenRepo,
    getUserFromEmail,
    getUserFromUsername,
    registerRepo
}