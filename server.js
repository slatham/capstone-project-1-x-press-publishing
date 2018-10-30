// set up express
const express = require('express');
const app = express();
// require and use the body parser middle-ware
const bodyParser = require('body-parser');
app.use(bodyParser());

// export app
module.export = app;

// set up where we serve static content from
app.use(express.static('public'));



// Set up Routers here.







// configure the port to listen on
const PORT = process.env.PORT || 4000;

// start the server on the port
app.listen(PORT,() => {

console.log(`Listening on port ${PORT}`);

});