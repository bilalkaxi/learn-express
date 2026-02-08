const { query } = require('../config/db.js');

async function createTables(){
    try{
        console.log(' creating tables...');

        await query(`
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                year INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
            console.log(`Table created !`)
        await query(`
            INSERT INTO books (title, author, year) 
            VALUES 
                ('The Hobbit', 'J.R.R. Tolkien', 1937),
                ('Harry Potter', 'J.K. Rowling', 1997),
                ('1984', 'George Orwell', 1949)
            ON CONFLICT DO NOTHING;
            `);
            console.log(`Sample data inserted`)
            process.exit(0);
    }
    catch(err){
        console.error( `error setting up database`)
        process.exit(1)
    }
}

createTables();