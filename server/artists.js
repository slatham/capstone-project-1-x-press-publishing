
// require the sql file with all the
// database functions
const db = require('./sql');


// set up the router
const artistsRouter = require('express').Router();
module.exports = artistsRouter;



// add a router.param to parse the id
artistsRouter.param('id', async (req,res,next,id) => {

	// get the artist by Id from the database
	try {
		// wait for the promise
		const artistReturned = await db.getArtistById("Artist", id);
		// Check if the artist was returned okay
		if (artistReturned) {
			// set the modelReturned on the request 
			req.artistReturned = artistReturned;
			// move on
			next()
		} else {
			// send the error to the error handler
			const error = new Error('Artist Not Found');
				error.status = 404;	// set error status
				return next(error);	// send the error on to the next middle-ware
		}
	} catch (e) {
		// catch any errors
		return next(e);
	}

	
});

// route for GET /api/artists
artistsRouter.get('/',(req,res,next) => {
	
	// run the db function and set a callback function
	// to deal with the results afterwards
	// this deals wit the asynchronous nature of the db request
	db.getAllWorkingArtists(results => {

		return res.status(200).json({artists: results});

	});
});

artistsRouter.get('/:id',(req,res,next) => {

	return res.status(200).json({artist:req.artistReturned});


});

