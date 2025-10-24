const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  // Store body in array
  const body = [];

  // Catch errors
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Put the recieved data in the array
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // When it is finished
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    // Call the handler function
    handler(request, response);
  });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addBook') {
    parseBody(request, response, jsonHandler.addBook);
  } else if (parsedUrl.pathname === '/addBookReview') {
    parseBody(request, response, jsonHandler.addBookReview);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getAllBooks') {
    jsonHandler.getAllBooks(request, response);
  } else if (parsedUrl.pathname === '/getBookByTitle') {
    jsonHandler.getBookByTitle(request, response);
  } else if (parsedUrl.pathname === '/getBookByLanguage') {
    jsonHandler.getBookByLanguage(request, response);
  } else if (parsedUrl.pathname === '/getBookByAuthor') {
    jsonHandler.getBookByAuthor(request, response);
  } else if (parsedUrl.pathname === '/docs') {
    htmlHandler.getDocs(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  // parse the url
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  
  // WIP testing to try to get query search params working.
  // Code from my friend Meakalia
  const {pathname, searchParams} = parsedUrl;

  request.query = Object.fromEntries(searchParams);

  // check if it is POST, otherwise it is GET
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
