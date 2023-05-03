const { Pool } = require('pg')
const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env

const pool_p = new Pool({
    user: POSTGRES_USER,
    host: 'localhost',
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: 5432,
})

module.exports = pool_p;