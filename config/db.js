const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'locahost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "bookstore_db",
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Admin',
    max : 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.connect((err,client,release) => {
    if(err){
        console.error("Error connecting", err.message)
    } else {
        console.log('Connected to database');
        release();
    }
});

pool.on('error',(err)=>{
    console.error('client error');
    process.exit(-1);
});

module.exports = {
    query: (text,params) => pool.query(text,params),
    pool,
}