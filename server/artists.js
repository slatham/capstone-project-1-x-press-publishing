
// require the sql file with all the
// database functions
const db = require('./sql');


// set up the router
const artistsRouter = require('express').Router();
module.exports = artistsRouter;

// route for GET /api/artists
artistsRouter.get('/',(req,res,next) => {
	
	// run the db function and set a callback function
	// to deal with the results afterwards
	// this deals wit the asynchronous nature of the db request
	db.getAllWorkingArtists(results => {

		return res.status(200).json({artists: results});

	});
});

