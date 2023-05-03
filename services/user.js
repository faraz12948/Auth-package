const { getUserFromEmail, getUserFromUsername, loginRepo, registerRepo, updateUserRepo } = require("../repositories/user");


const registerUser = async (username, email, password, isAdmin, tkn, pool) => {
    return await registerRepo({
        username,
        email,
        password,
        isAdmin,
        tkn,
        pool
    });
};
const loginUser = async (username, password, pool) => {
    return await loginRepo({
        username,
        password,
        pool
    });
};
const updateUser = async (email) => {
    return await updateUserRepo({
        email

    });
};

const getUserByEmail = async (email, pool) => {

    return await getUserFromEmail({ email, pool });
};
const getUserByUsername = async (username, pool) => {
    return await getUserFromUsername({ username, pool });
};


module.exports = {
    getUserByUsername,
    getUserByEmail,
    updateUser,
    loginUser,
    registerUser
}
