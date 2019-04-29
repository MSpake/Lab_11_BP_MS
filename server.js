'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

const app = express();
app.use(express.static('./public')); //for the purposes of our site, public is the root folder
app.use(express.urlencoded({ extended: true }));
app.set('view-engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();

app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in the urlencoded POST body and delete _method
    // change to a put or delete
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

//===============================
// Routes
//===============================

//render homepage on load, at this route
app.get('/', renderHomepage);

//renders detail view
app.get('/books/:id', renderDetailView);

app.put('/books/:id', updateBookDetails);

app.delete('/books/:id', deleteBook);

//render this form at this route
app.get('/new_search', searchForm);

//search results from API
app.post('/searches', bookSearch);

//when the user clicks add to library button, this saves the entry to the database
app.post('/save_to_library', saveToLibrary);




// below test renders page
app.get('/test', (request, response) => {
  response.render('pages/index.ejs');
});

//===============================
// SQL
//===============================

const SQL = {};
SQL.getAll = 'SELECT * FROM saved_books;';
SQL.getById = 'SELECT * FROM saved_books WHERE id=$1;';
SQL.saveBookToDatabase = 'INSERT INTO saved_books (title, author, description, image_url, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
//this command grabs the last single saved entry from the table
SQL.getLast = 'SELECT * FROM saved_books ORDER BY id DESC LIMIT 1;';
SQL.updateDetails = 'UPDATE saved_books SET title=$1, author=$2, description=$3, image_url=$4, isbn=$5, bookshelf=$6 WHERE id=$7';
SQL.deleteBook = 'DELETE FROM saved_books WHERE id=$1;';

//===============================
// Constructor
//===============================

function Book(book) {
  this.title = book.volumeInfo.title || 'Title not found';
  this.author = book.volumeInfo.authors || 'Could not find Author';
  this.description = book.volumeInfo.description || 'No description given.';
  this.image_url = book.volumeInfo.imageLinks ? (book.volumeInfo.imageLinks.thumbnail.substring(0, 4) + 's' + book.volumeInfo.imageLinks.thumbnail.slice(4, book.volumeInfo.imageLinks.thumbnail.length)) : 'Doesnotexist.jpg';
  this.isbn = book.volumeInfo.industryIdentifiers[0].identifier || 'Could not find ISBN';
  this.bookshelf;
}

//===============================
// Helper Functions
//===============================

function handleError(error, response) {
  response.render('pages/error.ejs', { status: 500, message: 'Something has gone wrong!' });
  console.log(error);
}

function renderHomepage(request, response) {
  client.query(SQL.getAll).then(result => {
    //first parameter indicates where content will be rendered, second parameter indicates retrived data from table.
    response.render('pages/index.ejs', { savedBooksArr: result.rows, route: null });
  }).catch(error => handleError(error, response));
}

function renderDetailView(request, response) {
  const selected = parseInt(request.params.id);
  client.query(SQL.getById, [selected]).then(result => {
    response.render('pages/books/detail.ejs', { showBook: result.rows[0], route: `/books/${selected}` });
  }).catch(error => handleError(error, response))
}

function searchForm(request, response) {
  response.render('pages/searches/new.ejs');
}

function bookSearch(request, response) {
  const query = request.body.search;
  console.log(query);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  superagent.get(url).then(result => {
    const bookResults = result.body.items.slice(0, 10);
    // console.log((bookResults[0].volumeInfo.imageLinks.thumbnail.substring(0, 4) + 's' + bookResults[0].volumeInfo.imageLinks.thumbnail.slice(4, bookResults[0].volumeInfo.imageLinks.thumbnail.length)));

    //bookArray puts content in format front end can use
    const bookArray = bookResults.map(indBook => {
      return new Book(indBook);
    });
    response.render('pages/searches/show.ejs', { bookArray: bookArray, route: '/save_to_library' });
    // response.send(bookArray);
  }).catch(error => handleError(error, response));
}

function saveToLibrary(request, response) {
  const { title, author, description, image_url, isbn, bookshelf } = request.body;
  //saves the selected book information to the database
  client.query(SQL.saveBookToDatabase, [title, author, description, image_url, isbn, bookshelf]).then(result => {
    client.query(SQL.getLast).then(result => {
      const id = result.rows[0].id;
      response.redirect(`/books/${id}`);
    })
  }).catch(error => handleError(error, response));
}

function updateBookDetails(request, response) {
  const selected = parseInt(request.params.id);
  const { title, author, description, image_url, isbn, bookshelf } = request.body;

  client.query(SQL.updateDetails, [title, author, description, image_url, isbn, bookshelf, selected]).then(result => {
    response.redirect('/');
  })

}

function deleteBook(request, response) {
  const selected = parseInt(request.params.id);
  client.query(SQL.deleteBook, [selected]).then(result => {
    response.redirect('/');
  })
}

//===============================

app.listen(PORT, () => { console.log(`App is up on PORT ${PORT}`) });
