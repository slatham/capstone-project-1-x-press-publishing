const db = require('./sql')

// set up the router
const seriesRouter = require('express').Router();
module.exports = seriesRouter;

// set up the issues router with a merge on the router param
// of this series router
const issuesRouter =  require('./issues');
seriesRouter.use('/:id/issues', issuesRouter);


const checkValidInput = (req,res,next) => {

	// check we have all the supplied posted values
	const name = req.body.series.name;
	const description = req.body.series.description;

	// do the check
	if(!name || !description ) {
		return res.status(400).send();
	}

	next()


}

// add a router.param to parse the id
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


seriesRouter.get('/:id',(req,res,next) => {

	return res.status(200).json({series:req.seriesReturned});


});

// route to create a new series
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

seriesRouter.delete('/:id', async (req,res,next) => {
console.log('Delete')
	try {
		const issues = await db.getAllIssuesBySeriesId(req.seriesReturned.id);
		console.log(issues.length);

		if (issues.length === 0){

		// try the promise and wait for it to return
		const results = await db.deleteSeries(req.seriesReturned.id);
		// return the results
		return res.status(204).send();
		
		} else {

			return res.status(400).send();

		}
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}


});

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




