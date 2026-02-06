const testAPI = async () => {
    const baseURL = 'http://localhost:3000/api';
    const booksURL = `${baseURL}/books`;


// console.log('Testing GET method');
// const allBooks = await fetch(`${baseURL}/books`).then(res => res.json());
// console.log(allBooks)

// console.log('Testing GET by ID');
// const bookById = await fetch(`${baseURL}/books/1`).then( res => res.json());
// console.log(bookById);

console.log(`POST METHOD`);
const newBook = await fetch(`${booksURL}`,{
    method : 'POST',
    headers: {
        'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
        title: 'Test Book',
        author: 'Test author'
    })
}).then(res => res.json())
console.log(newBook);
}


testAPI()