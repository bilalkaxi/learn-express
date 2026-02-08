const { Client } =require('pg');
require('dotenv').config();

async function createDatabase(){
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log(`Connected to database`)

        const dbExists = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
        );

        if (dbExists.rows.length === 0) {
            console.log(`Creating datbase : ${process.env.DB_NAME}`);
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log('database created');
        } else {
            console.log('database already exists')
        }

        await client.end();
        console.log('run " npm run setup-tables "')
    }
    catch( error ){
        console.error(`Error : `, error.message)
        process.exit(1);
    }
}

createDatabase();