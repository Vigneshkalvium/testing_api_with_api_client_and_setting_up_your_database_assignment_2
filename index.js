const express = require('express')
const fs = require("fs")
const app = express()
app.use(express.json())
const PORT = 8000
const DATA_FILE = 'data.json'

// Load Books from the file
const loadBooks = () =>{
  try{
    const data = fs.readFileSync(DATA_FILE,'utf-8')
    return JSON.parse(data)
  }catch(error){
    return [];
  }
}

const saveBooks = (books) => {
  try{
    fs.writeFileSync(DATA_FILE,JSON.stringify(books,null,2))
  }
  catch(error){
    console.log(error)
  }
}

app.post('/books',(req,res)=>{
  const {book_id,title,author,genre,year,copies} = req.body;
  if(!book_id || !title || !author || !genre || !year || !copies){
    return res.status(400).json({error: 'All fields are required'})
  }

  const books = loadBooks();

  if(books.some(b => b.book_id === book_id)){
    return res.status(400).json({error:"Book id already exixts"})
  }

  const newBook = {book_id,title,author,genre,year,copies}
  books.push(newBook);
  saveBooks(books)
})
app.get('/books',(req,res)=>{
  const books  = loadBooks()
  res.json(books)
})

app.get('/books/:id',(req,res)=>{
  const books = loadBooks()
  const book = books.find(b=> b.book_id === req.params.id)

  if(!book){
    return res.status(400).json({error:"Book not found"})
  }
  res.json(book)
})

app.put('/books/:id', (req, res) => {
  const { title, author, genre, year, copies } = req.body;
  const books = loadBooks();
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  books[bookIndex] = { ...books[bookIndex], title, author, genre, year, copies };
  saveBooks(books);
  
  res.json(books[bookIndex]);
});

app.delete('/books/:id', (req, res) => {
  let books = loadBooks();
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  books = books.filter(b => b.book_id !== req.params.id);
  saveBooks(books);
  
  res.json({ message: 'Book deleted successfully' });
});



app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})
