const { Pool } = require('pg')
const dotenv = require('dotenv');
dotenv.config();

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env

const pool_p = new Pool({
    user: 'faraz',
    host: 'localhost',
    database: 'ca-mgt',
    password: 'faraz12948fab',
    port: 5432,
})

// const pool_p = new Pool({
//     user: POSTGRES_USER,
//     host: 'localhost',
//     database: POSTGRES_DB,
//     password: POSTGRES_PASSWORD,
//     port: 5432,
// })

module.exports = pool_p;

// function createPool(user, password, host, port, database) {
//     const pool = new Pool({
//         user: user,
//         password: password,
//         host: host,
//         port: port,
//         database: database,
//     });

//     return pool;
// }

// module.exports = createPool;