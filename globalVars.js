
let pool;
let accessTokenSecret;
let email;
let appPassword;

module.exports = {
    setPool: function (p) { pool = p; },
    getPool: function () { return pool; },
    setAccessTokenSecret: function (s) { accessTokenSecret = s; },
    getAccessTokenSecret: function () { return accessTokenSecret; },
    setEmail: function (e) { email = e; },
    getEmail: function () { return email; },
    setAppPassword: function (p) { appPassword = p; },
    getAppPassword: function () { return appPassword; }
};
