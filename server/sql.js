// set up sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// db function to return all artists
// this is an example of how to handle
// async operations with callbacks.
const getAllWorkingArtists =  (callback) => {

	 db.all('SELECT * FROM Artist WHERE is_currently_employed = 1',  (err,rows) => {
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
		
		// run the callback function with
		// the rows
		callback(rows)
	});
};

// db function 
const getAllSeries = () => {
return new Promise ((resolve, reject) => {
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
			resolve(rows)
		});
});
}
module.exports = { getAllWorkingArtists, getAllSeries };