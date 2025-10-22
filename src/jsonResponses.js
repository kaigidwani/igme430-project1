const books = {};

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

// return book object as JSON
const getBooks = (request, response) => {
  const responseJSON = {
    books,
  };

  respondJSON(request, response, 200, responseJSON);
};

// function to add a book from a POST body
const addBook = (request, response) => {
  // default failure json message
  const responseJSON = {
    message: 'All fields are required.',
  };

  // get fields
  const { author, country, language, link, pages, title, year, genres } = request.body;

  // check to make sure we have all fields
  if (!author || !country || !language || !link || !pages || !title || !year || !genres ) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the book doesn't exist yet
  if (!books[title]) {
    // Set the status code to 201 (created) and create an empty book
    responseCode = 201;
    books[title] = {
      title,
    };
  }

  // add or update fields for this book

  books[title].author = author;
  books[title].country = country;
  books[title].language = language;
  books[title].link = link;
  books[title].pages = pages;
  books[title].year = year;
  books[title].genres = genres;

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
  getBooks,
  addBook,
  notFound,
};
