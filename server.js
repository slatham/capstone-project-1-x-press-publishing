/*
Starting point for the app.  Run this with node server.js
to start the app running.
*/

// set up express
const express = require('express');
const app = express();

// require and use the body parser middle-ware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// Middle-ware for handling CORS
const cors = require('cors');
app.use(cors());
// verbose logging middle-ware
const morgan = require('morgan')
app.use(morgan('dev'))

// set up where we serve static content from
app.use(express.static('public'));

// Set up base router here.
const apiRouter = require('./server/api');
// mount the router at the start of /api
app.use('/api',apiRouter);

// error handler - remember this has to be last to catch the errors!
// it is recognised as error handling middle-ware because 
//it takes 4 arguments
app.use(function(error, req, res, next) {
  // deal with the error
  console.log(error);
  res.json({ message: error.message });
});

// configure the port to listen on
const PORT = process.env.PORT || 4000;

// start the server on the port
app.listen(PORT,() => {

console.log(`Listening on port ${PORT}`);

});

// export app for testing suite to access
module.exports = app;