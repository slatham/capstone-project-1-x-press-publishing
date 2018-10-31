// set up the router
const artistsRouter = require('express').Router();
module.exports = artistsRouter;

// set up sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistsRouter.get('/',(req,res,next) => {
	
	db.all('SELECT * FROM Artist WHERE is_currently_employed = 1',(err,rows) => {

		if(err) {
			next(err);
		}
		
		res.status(200).json({artists: rows});
		

	});


});

