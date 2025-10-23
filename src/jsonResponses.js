const books = require('../data/books.json');

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // Responses that don't get a body
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

// === GET endpoints ===

// return all books as JSON
const getAllBooks = (request, response) => {
  const responseJSON = {
    books,
  };

  respondJSON(request, response, 200, responseJSON);
};

// return searched book by title as JSON
const getBookByTitle = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'All fields are required.',
  };

  // get the title field
  const { title } = request.body;

  // .filter gets an array of items
  // use .find instead to get only the first item
  const book = books.find((b) => b.title === title);

  // If the book doesn't exist
  if (!book) {
    // Update the error message and ID, and return the error
    responseJSON.message = `No book with title ${title}`;
    responseJSON.id = 'bookNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Add the book to the JSON response
  responseJSON.searchedBook = book;

  return respondJSON(request, response, 200, responseJSON);
};

// return searched book by language as JSON
const getBookByLanguage = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'Language field is required.',
  };

  // get the language field
  const { language } = request.body;

  // Using .filter to get array of books
  const book = books.filter((b) => b.language === language);

  // If no books exist with that language
  if (!book) {
    // Update the error message and ID, and return the error
    responseJSON.message = `No books with language ${language}`;
    responseJSON.id = 'bookNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Add the books to the JSON response
  responseJSON.searchedBooks = book;

  return respondJSON(request, response, 200, responseJSON);
};

// return searched book by author as JSON
const getBookByAuthor = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'Author field is required.',
  };

  // get the author field
  const { author } = request.body;

  // Using .filter to get array of books
  const book = books.filter((b) => b.author === author);

  // If no books exist by that author
  if (!book) {
    // Update the error message and ID, and return the error
    responseJSON.message = `No books with author ${author}`;
    responseJSON.id = 'bookNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Add the books to the JSON response
  responseJSON.searchedBooks = book;

  return respondJSON(request, response, 200, responseJSON);
};

// === POST endpoints ===

// function to add a book from a POST body
const addBook = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'All fields are required.',
  };

  // get fields
  const {
    author, country, language, link, pages, title, year, genres,
  } = request.body;

  // check to make sure we have all fields, except rating as it is optional
  if (!author || !country || !language || !link || !pages || !title || !year || !genres) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // Check if the book exists in the list already
  const book = books.find((b) => b.title === title);

  // If the book doesn't exist yet
  if (!book) {
    // Set the status code to 201 (created) and add the empty book
    responseCode = 201;
    books.push(book);
  }

  // add or update fields for this book

  book.title = title;
  book.author = author;
  book.country = country;
  book.language = language;
  book.link = link;
  book.pages = pages;
  book.year = year;
  book.genres = genres;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

// function to add a book review from a POST body
const addBookReview = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'Both title and rating are required.',
  };

  // get fields
  const { title, rating } = request.body;

  // check to make sure we have all fields
  if (!title || !rating) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  const responseCode = 204;

  // Check if the book exists in the list already
  const book = books.find((b) => b.title === title);

  // If the book doesn't exist
  if (!book) {
    // Update the error message and ID, and return the error
    responseJSON.message = `No book to rate with title ${title}`;
    responseJSON.id = 'noBookToRate';
    return respondJSON(request, response, 400, responseJSON);
  }

  // add or update fields for this book

  book.rating = rating;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// public exports
module.exports = {
  getAllBooks,
  getBookByTitle,
  getBookByLanguage,
  getBookByAuthor,
  addBook,
  addBookReview,
  notFound,
};
