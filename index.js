const express = require('express')
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const port = 3000;

app.get('/',(req,res)=>{
    res.json({
        message: "welcome to our bookstore api !",
        version: '1.0.0',
        endpoints: {
            book: '/api/books',
            booksById: "/api/books/:id",
            addBook: 'POST /api/books',
            updateBook: 'PUT /api/books/:id',
            deleteBook:'DELETE /api/books/:id'
        }
    });
});
//data
let books = [
    { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 },
    { id: 2, title: 'Harry Potter', author: 'J.K. Rowling', year: 1997 },
    { id: 3, title: '1984', author: 'George Orwell', year: 1949 }
];
//function
const getNextId = ()=> {
    return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
}
//get
app.get('/api/books',(req,res) => {
    res.json({
        success: true,
        count: books.length,
        data: books
    })
})
//get by id
app.get('/api/books/:id',(req,res) => {
    const id = parseInt(req.params.id);
    const book = books.find(book => book.id === id);

    if(!book){
        return res.status(404).json({
            success: false,
            message : `Book with ID ${id} not found`
        })
    }
    res.json({
        succes:true,
        data:book
    })
})
//post
app.post('/api/books/',(req,res) => {
    const { title, author, year} = req.body;

    if(!title || !author) {
        return res.status(404).json({
            succes: false,
            message :  ' Please provide full credentials '
        })
    }
    const newBook = {
        id : getNextId(),
        title,
        author,
        year: year || new Date().getFullYear()
    }
    books.push(newBook);

    res.status(201).json({
        succes: true,
        message : 'Book created Succesfully',
        data : newBook  
    })
})
//query
app.get('/api/books/search',(req,res) => {
    const { title, author } = req.query;
    let filteredBooks = [...books];

        if(title){
            filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(title.toLowerCase())
        );
    }

    if(author){
        filteredBooks = filteredBooks.filter(book => 
            book.author.toLowerCase().includes(author.toLowerCase())
        );
    }
    res.json({
        succes:true,
        count: filteredBooks.length,
        data : filteredBooks
    });
});

    
//PUT
app.put('/api/books/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const { title, author, year} = req.body;

    const bookIndex = books.findIndex(book => book.id === id);

    if(bookIndex === -1){
        return res.status(404).json({
            succes: false,
            message: `Book with ID ${id}, title : ${title} does not exist`
        })
    }

    //update book
    books[bookIndex]={
        ...books[bookIndex],
        title : title || books[bookIndex].title,
        author : author || books[bookIndex].author,
        year : year || books[bookIndex].year
    };

    res.json({
        succes :true,
        message : `BOOK ID ${books[bookIndex].id} was updated`,
        data : books[bookIndex]
    })
})
//delete
app.delete('/api/books/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex(book => book.id = id);

    if(bookIndex === -1){
        return res.status(404).json({
            success: false,
            message: `Book ID ${id} not found`
        });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    res.json({
        succes: true,
        message: `Book deleted successfully`,
        data: deletedBook
    });
});

//404 handler
app.use(/.*/, (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
//middleware
app.use((err,req,res,next) => {
    console.log(err.stack);
    res.status(500).json({
        succes:false,
        message: `Something Went Wrong`,
        error: proces.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
//cors
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE']
}))
//listen
app.listen(port,()=>{
    console.log(`Server is listening on http://localhost:${port}`)
})