const db = require('./sql')

// set up the router
const seriesRouter = require('express').Router();
module.exports = seriesRouter;

// set up the route for GET /api/series
seriesRouter.get('/', async (req,res,next) => {
	// use Promise with async / await 
	// syntax to deal with the asynchronus 
	// database read, then return the results
	try {
		// try the promise and wait for it to return
		const results = await db.getAllSeries();
		// return the results
		return res.status(200).json({series: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});