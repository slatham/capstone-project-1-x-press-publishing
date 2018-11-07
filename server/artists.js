
// This file handles all the express routing for artists route

// require the sql file with all the
// database functions
const db = require('./sql');

// set up the artist router
const artistsRouter = require('express').Router();
// export it so it can be celled in the api.js file
module.exports = artistsRouter;

// helper function to check valid inputs
// on POST and PUT requests
const checkValidInput = (req,res,next) => {
	// check we have all the supplied posted values
	const name = req.body.artist.name;
	const dateOfBirth = req.body.artist.dateOfBirth;
	const biography = req.body.artist.biography;
	// set this field by default
	req.body.artist.isCurrentlyEmployed = 1;
	// do the check
	if(!name || !dateOfBirth || !biography) {
		return res.status(400).send();
	}

	// continue to the next middle-ware
	next();
}

// add a router.param to parse the id for /artist/:id
// function is async because we use await to wait for
// the promise to be returned from the db function call
artistsRouter.param('id', async (req,res,next,id) => {
	// get the artist by Id from the database
	try {
		// wait for the promise
		const artistReturned = await db.getById('Artist',id);
		// Check if the artist was returned okay
		if (artistReturned) {
			// set the modelReturned on the request 
			req.artistReturned = artistReturned;
			// move on
			next();
		} else {
			// send the error to the error handler
			const error = new Error('Artist Not Found');
				error.status = 404;	// set error status
				return next(error);	// send the error on to the next middle-ware
		}
	} catch (e) {
		// catch any errors returned
		return next(e); // send the error on to the next middle-ware
						// eventually it'll reach our error handler
	}
});

// route for GET /api/artists
// NOTE this function uses a call back instead
// of using promises like the rest of the app
// this is just for future reference.
artistsRouter.get('/',(req,res,next) => {
	// run the db function and set a callback function
	// to deal with the results afterwards
	// this deals wit the asynchronous nature of the db request
	db.getAllWorkingArtists((error, results) => {
		// if an error is set on the callback function
		if (error) {
			// send the error on towards our error handler
			return next(error);
		} else {
		// everything is okay, return the artists object as json string
		return res.status(200).json({artists: results});
		}
	});
});

// route to get an artist by ID
artistsRouter.get('/:id',(req,res,next) => {
	// This is handled by our param function above
	// it sets the artist to an object on the request for us
	// we simply have to return it here.
	return res.status(200).json({artist:req.artistReturned});

});

// route to create a new artist
artistsRouter.post('/', checkValidInput, async (req,res,next)=>{

	try {
		// try the promise and wait for it to return
		const results = await db.addNewArtist(req.body);
		// return the results
		return res.status(201).json({artist: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)	
	}

});

// route to delete an artist
artistsRouter.delete('/:id', async (req,res,next) => {

	try {
		// try the promise and wait for it to return
		const results = await db.deleteArtist(req.artistReturned.id);
		// return the results
		return res.status(200).json({artist: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});

// route to update an artist.  Note the middle-ware stack.  We first check the input,
// then run the callback function.
artistsRouter.put('/:id', checkValidInput, async (req,res,next) => {

	try {
		// try the promise and wait for it to return
		const results = await db.updateArtist(req.body,req.artistReturned.id);
		// return the results
		return res.status(200).json({artist: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});
