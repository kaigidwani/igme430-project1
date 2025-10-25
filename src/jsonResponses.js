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
  const title = request.query.title;

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
  responseJSON.books = book;

  return respondJSON(request, response, 200, responseJSON);
};

// return searched book by language as JSON
const getBooksByLanguage = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'All fields are required.',
  };

  // get the language field
  const language = request.query.language;
  
  // .filter gets an array of items
  // use .find instead to get only the first item
  const book = books.filter((b) => b.language === language);

  // If the book doesn't exist
  if (!book) {
    // Update the error message and ID, and return the error
    responseJSON.message = `No book with language ${language}`;
    responseJSON.id = 'bookNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Add the book to the JSON response
  responseJSON.books = book;

  return respondJSON(request, response, 200, responseJSON);
};

// return searched book by author as JSON
const getBooksByAuthor = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'All fields are required.',
  };

  // get the author field
  const author = request.query.author;
  
  // .filter gets an array of items
  // use .find instead to get only the first item
  const book = books.filter((b) => b.author === author);

  // If the book doesn't exist
  if (!book) {
    // Update the error message and ID, and return the error
    responseJSON.message = `No book with author ${author}`;
    responseJSON.id = 'bookNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Add the book to the JSON response
  responseJSON.books = book;

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
    author, country, language, link, pages, title, year, genre1, genre2,
  } = request.body;

  // check to make sure we have all fields
  if (!author || !country || !language || !link
      || !pages || !title || !year || !genre1 || !genre2) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // Check if the book exists in the list already
  const bookExists = books.find((b) => b.title === title);

  // If the book doesn't exist yet
  if (!bookExists) {
    // Set the status code to 201 (created) and add the empty book
    responseCode = 201;
    // Pushes an empty object
    books.push({});
  }

  // add or update fields for this book

  books[books.length - 1].author = author;
  books[books.length - 1].country = country;
  books[books.length - 1].language = language;
  books[books.length - 1].link = link;
  books[books.length - 1].pages = Number(pages);
  books[books.length - 1].title = title;
  books[books.length - 1].year = Number(year);
  books[books.length - 1].genres = [genre1, genre2];

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
  getBooksByLanguage,
  getBooksByAuthor,
  addBook,
  addBookReview,
  notFound,
};
