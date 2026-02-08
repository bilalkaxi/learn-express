require('dotenv').config();
const express = require('express');
const bookModel = require('./models/bookModel.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(async (req,res,next) => {
    try {
        await bookModel.getAllBooks();
        next();
    } catch (error) {
        console.error('database connection failed', error.message);
        res.status(500).json({
            success: false,
            message : ' Database connection failed. Please check your PostgreSQL setup.',
            setupSteps: [
                '1. Make sure PostgreSQL is running',
                '2. Run: npm run create-db',
                '3. Run: npm run setup-tables'
            ]
        })
    }
})
// welcome

app.get('/',(req,res)=>{
    res.json({
        message: 'Welcome to boostore API',
        version: '2.0.0',
        database: 'PostgreSQL',
        endpoints: {
            books : 'GET /api/books/:id',
            bookById: 'GET /api/books/:id',
            addBook: 'POST /api/books',
            updateBook: 'PUT /api/books/:id',
            deleteBook: 'DELETE /api/books/:id',
            searchBooks: 'GET /api/books/search?title=..$author...'
        },
        setup: 'Run "npm run setup-db" if this is your first time'
    })
})

//Get All books
app.get('/api/books',async ( req,res ) => {
    try {
        const books = await bookModel.getAllBooks();
        res.json({
            succes:true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log('Error :',error);
        res.status(500).json({
            succes: false,
            message: 'falied to fetch books',
        })
    }
});
//GET by ID
app.get('/api/books/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message: 'Invalid book ID'
            });
        }
        const book = await bookModel.getBookById(id);
        
        if(!book){
            return res.status(404).json({
                success: false,
                message: `book eith ID ${id} not found`
            });
        }
        res.json({
            success:true,
            data:book
        })
    } catch (error){
        console.error('Error: ',error.message);
        res.status(500).json({
            success:false,
            message:"Failed to fetch book"
        });
    }
});

//post
app.post('/api/books',async (req,res)=> {
    try {
        const { title,author,year } = req.body;

        if ( !title || !author) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and author'
            });
        }
        const newBook = await bookModel.createBook(
            title,author,year || new Date().getFullYear()
        );
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: newBook
        });
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create book'
        });
    }
});

//PUT - Update a book

app.put('/api/books/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const { title,author,year } = req.body;

        if(isNaN) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID'
            });
        }
        const exsitingBook = await bookModel.getBookById(id);
        if(!existingBook) {
            return res.status(404).json({
                succes:false,
                message: `Book with ID ${id} Not found`
            });
        }
        const updatedBook = await bookModel.updateBook(
            id,title,author,year
        );

        res.json({
            success:true,
            message: `Book Updated successfully`,
            data : updatedBook
        });
            
    }
    catch (error) {
        console.log("Error: ",error.message);
        res.json({
            success: false,
            message: "Failed to update book"
        })
    }
})

app.delete('/api/books/:id',async (req,res) => {
    try {
        const id = parseInt(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:'Invalid book ID'
            });
        }
        const existingBook = await bookModel.getBookById(id);
        if(!existingBook){
            return res.status(404).json({
                success: false,
                message: `Book with ID ${id} not found`
            });
        }
        const deletedBook = await bookModel.deleteBook(id);

        res.json({
            succes:true,
            message: `Book deleted Successfully`,
            data: deletedBook
        });
    } catch(error) {
        console.log('error: ',error.message);
        res.status(404).json({
            succes: false,
            message: "Falied, error"
        })
    }
});

app.get('/api/books/search',async (req,res)=>{
    try {
        const { title,author } = req.query;
        const books = await bookModel.searchBooks(title,author);

        res.json({
            success: true,
            count : books.length,
            filters: { title, auhor },
            data: books
        });
    } catch (error) {
        console.log(`Error : `,error.message);
        res.status(500).json({
            succes:false,
            message:`Failed to search Books`
        });
    }
})

// 404

app.use(/.*/,(req,res)=>{
    res.status(404).json({
        success:false,
        message:'Route not found'
    });
})

app.use((err,req,res,next) => {
    console.error(`Server error: ${err.stack}`);
    res.status(500).json({
        success:false,
        message:`Something went wrong`,
        error : process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

app.listen(PORT,() => {
    console.log(`
            🚀 Server is running on http://localhost:${PORT}
    
    📊 PostgreSQL API Setup Complete!
    
    Next steps:
    1. Make sure PostgreSQL is installed and running
    2. Run: npm run setup-db
    3. Test your API with the endpoints below
    
    Endpoints to test:
    GET  http://localhost:${PORT}/api/books
    POST http://localhost:${PORT}/api/books
    PUT  http://localhost:${PORT}/api/books/1
    `)
});