/*
Base router, pull other routers in from here
*/

// set up express
const express = require('express');
// set up the api router and export it so as it can be imported and
// used in the server.js file -- i.e. the starting point for the app
const apiRouter = express.Router();
module.exports = apiRouter;
// set up routers for artist and series express routes
const artistsRouter = require('./artists');
const seriesRouter = require('./series');
// mount these routes on the apiRouter
apiRouter.use('/artists', artistsRouter);
apiRouter.use('/series', seriesRouter);

/*

server.js 	  series.js          issues.js
/api  <------ /series <--------- /issues

			  artists.js
	  <------ /artists



*/