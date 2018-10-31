/*
Starting point for the app.  Run this with node server.js
to start the app running.
*/

// set up express
const express = require('express');
const app = express();

// Set up middleware
// require and use the body parser middle-ware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// Middleware for handling CORS
const cors = require('cors');
app.use(cors());
const morgan = require('morgan')
app.use(morgan('dev'))

// set up where we serve static content from
app.use(express.static('public'));

// Set up Routers here.
const apiRouter = require('./server/api');
// mount the router at the start of /api
app.use('/api',apiRouter);


// configure the port to listen on
const PORT = process.env.PORT || 4000;

// start the server on the port
app.listen(PORT,() => {

console.log(`Listening on port ${PORT}`);

});

// export app for testing
module.exports = app;