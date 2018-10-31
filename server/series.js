// set up sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// set up the router
const seriesRouter = require('express').Router();
module.exports = seriesRouter;

// set up the route for GET /api/series
seriesRouter.get('/',(req,res,next) => {

	db.all('SELECT * FROM Series',(err,rows) => {
		// if there's an error raise it 
		// attach some info and send it to the error handler middle-ware
		if(err) {
			// create a new error object
			const error = new Error('Series Not Found');
			error.status = 404;	// set error status
			error.body = err;	// set error body
			return next(error);	// send the error on to the next middle-ware
								// eventually it'll reach the error handler 
		}
		// all is well send back the results
		return res.status(200).json({series: rows});
	});

});