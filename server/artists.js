// set up sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// set up the router
const artistsRouter = require('express').Router();
module.exports = artistsRouter;

// route for GET /api/artists
artistsRouter.get('/',(req,res,next) => {
	
	db.all('SELECT * FROM Artist WHERE is_currently_employed = 1',(err,rows) => {
		// if there's an error raise it 
		// attach some info and send it to the error handler middle-ware
		if(err) {
			// create a new error object
			const error = new Error('Artist Not Found');
			error.status = 404;	// set error status
			error.body = err;	// set error body
			return next(error);	// send the error on to the next middle-ware
								// eventually it'll reach the error handler 
		}
		// all is good send back the results of the query
		return res.status(200).json({artists: rows});	
	});
});

