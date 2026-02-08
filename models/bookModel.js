const db = require('../config/db');

// Get all books
const getAllBooks = async () => {
    try {
        const result = await db.query(
            'SELECT * FROM books ORDER BY created_at DESC'
        );
        return result.rows;
    } catch (error) {
        throw new Error(`Error getting books: ${error.message}`);
    }
};

// Get book by ID
const getBookById = async (id) => {
    try {
        const result = await db.query(
            'SELECT * FROM books WHERE id = $1',
            [id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error getting book: ${error.message}`);
    }
};

// Create a new book
const createBook = async (title, author, year) => {
    try {
        const result = await db.query(
            `INSERT INTO books (title, author, year) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [title, author, year]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error creating book: ${error.message}`);
    }
};

// Update a book
const updateBook = async (id, title, author, year) => {
    try {
        const result = await db.query(
            `UPDATE books 
             SET title = COALESCE($2, title),
                 author = COALESCE($3, author),
                 year = COALESCE($4, year),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id, title, author, year]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error updating book: ${error.message}`);
    }
};

// Delete a book
const deleteBook = async (id) => {
    try {
        const result = await db.query(
            'DELETE FROM books WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error deleting book: ${error.message}`);
    }
};

// Search books
const searchBooks = async (title, author) => {
    try {
        let query = 'SELECT * FROM books WHERE 1=1';
        const params = [];
        let paramCount = 1;
        
        if (title) {
            query += ` AND title ILIKE $${paramCount}`;
            params.push(`%${title}%`);
            paramCount++;
        }
        
        if (author) {
            query += ` AND author ILIKE $${paramCount}`;
            params.push(`%${author}%`);
        }
        
        query += ' ORDER BY title';
        
        const result = await db.query(query, params);
        return result.rows;
    } catch (error) {
        throw new Error(`Error searching books: ${error.message}`);
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks
};