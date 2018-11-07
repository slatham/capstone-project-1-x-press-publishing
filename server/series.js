// file to handle all of the express routes for 
// /api/series routes

// import the db functions to interact with our database
const db = require('./sql')

// set up the express router
const seriesRouter = require('express').Router();
// export it so it can be used in api.js
module.exports = seriesRouter;

// set up the issues router with a merge on the router param
// of this series router.  So series has many issues
// /api/series/:id/issues
const issuesRouter =  require('./issues');
seriesRouter.use('/:id/issues', issuesRouter);

// helper function to check for valid
// input on POST and PUT requests
const checkValidInput = (req,res,next) => {
	// check we have all the supplied posted values
	const name = req.body.series.name;
	const description = req.body.series.description;
	// do the check
	if(!name || !description ) {
		return res.status(400).send();
	}
	// carry on with the next middleware
	next()
}

// add a router.param to parse the id for series
seriesRouter.param('id', async (req,res,next,id) => {

	// get the series by Id from the database
	try {
		// wait for the promise
		const seriesReturned = await db.getById('Series',id);
		// Check if the series was returned okay
		if (seriesReturned) {
			// set the modelReturned on the request 
			req.seriesReturned = seriesReturned;
			// move on
			next()
		} else {
			// send the error to the error handler
			const error = new Error('Series Not Found');
				error.status = 404;	// set error status
				return next(error);	// send the error on to the next middle-ware
		}
	} catch (e) {
		// catch any errors
		return next(e);
	}

});

// set up the route for GET /api/series.  Note the route is
// just '/' becuase we've mounted the router on top of the api
// router then on the path /series
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

// express route to get series by id
seriesRouter.get('/:id',(req,res,next) => {
	// all the hard work is done in the router param function above
	// we just return that hard work here.
	return res.status(200).json({series:req.seriesReturned});

});

// route to create a new series not it runs the checkValidInput function first
// before moving onto the callback function
seriesRouter.post('/', checkValidInput, async (req,res,next)=>{

	try {
		// try the promise and wait for it to return
		const results = await db.addNewSeries(req.body);
		// return the results
		return res.status(201).json({series: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});

// express route to delete a series.  Note the async becuase the 
// db deletion is done asynchronously via promises.
seriesRouter.delete('/:id', async (req,res,next) => {

	try {
		// before delete, check there's no existing issues for this series
		const issues = await db.getAllIssuesBySeriesId(req.seriesReturned.id);

		// if there's no issues for this series
		if (issues.length === 0){

			// try the promise and wait for it to return
			const results = await db.deleteSeries(req.seriesReturned.id);
			// return the results
			return res.status(204).send();
		
		} else {
			// there are issues for this series, can't delete.
			return res.status(400).send();

		}
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});

// express route to update a series, checking the input first 
seriesRouter.put('/:id', checkValidInput, async (req,res,next) => {

	try {
		// try the promise and wait for it to return
		const results = await db.updateSeries(req.body,req.seriesReturned.id);
		// return the results
		return res.status(200).json({series: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});