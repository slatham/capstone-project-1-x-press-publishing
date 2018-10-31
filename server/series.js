// set up sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const seriesRouter = require('express').Router();
module.exports = seriesRouter;

seriesRouter.get('/',(req,res,next) => {


	db.all('SELECT * FROM Series',(err,rows) => {

		res.send({series: rows});
		

	});

	
	
});