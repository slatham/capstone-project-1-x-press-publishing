
// require the sql file with all the
// database functions
const db = require('./sql');


// set up the router
const artistsRouter = require('express').Router();
module.exports = artistsRouter;

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

	next()


}

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
