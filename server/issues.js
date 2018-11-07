// file to handle express routes for issues /api/series/:id/issues

// import all the db functions we'll need
const db = require('./sql')

// set up the router
// set merge params to true do as we can access the parameters set on
// the series part of the route that is handles in series.js
const issuesRouter = require('express').Router({mergeParams:true});
// export so it can be called in series.js
module.exports = issuesRouter;

// helper function to check valid input on POST and PUT
// requests
const checkValidInput = (req,res,next) => {

	// check we have all the supplied posted values
	const name = req.body.issue.name;
	const issueNumber = req.body.issue.issueNumber;
	const publicationDate = req.body.issue.publicationDate;
	const artistId = req.body.issue.artistId;

	req.body.issue.seriesId = req.seriesReturned.id;
	// do the check
	if(!name || !issueNumber || !publicationDate || !artistId ) {
		return res.status(400).send();
	}
	// carry on with the middleware stack
	next();
}

// set up the router param to parse the id passed on all routes
// and check it is valid, then add the returned valid issue to the req
// object for use in other routes
issuesRouter.param('id', async (req,res,next,id) =>{

	try {
		// wait for the promise
		const issueReturned = await db.getById('Issue',id);
		// Check if the artist was returned okay
		if (issueReturned) {
			// set the modelReturned on the request 
			req.issueReturned = issueReturned;
			// move on
			next()
		} else {
			// send the error to the error handler
			const error = new Error('Issue Not Found');
				error.status = 404;	// set error status
				return next(error);	// send the error on to the next middle-ware
		}
	} catch (e) {
		// catch any errors
		return next(e);
	}

});

// route to handle get all issues for a series
issuesRouter.get('/', async (req,res,next) => {
	
	try {
		// because we have merge parameters set to true we can access the 
		// series id handled by the router param funtion in
		// series.js
		// assign the series id
		const seriesId = req.seriesReturned.id;
		// try the promise and wait for it to return
		const results = await db.getAllIssuesBySeriesId(seriesId);
		// return the results
		return res.status(200).json({issues: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});

// add new issue on the series
issuesRouter.post('/', checkValidInput, async (req,res,next)=>{

	try {
		// because we have merge parameters set to true we can access the 
		// series id handled by the router param funtion in
		// series.js
		// assign the series id
		const seriesId = req.seriesReturned.id;
		// try the promise and wait for it to return
		const results = await db.addNewIssue(req.body,seriesId);
		// return the results
		return res.status(201).json({issue: results});
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});

// update an issue's details after checking for valid input
issuesRouter.put('/:id', checkValidInput, async (req,res,next) =>{

	try {
		// try the promise and wait until it is resolved
		const results = await db.updateIssue(req.body,req.issueReturned.id);
		return res.status(200).json({issue: results});
	} catch (e) {
		// send the error to our handler
		next(e);
	}



});

// express route to delete an issue by id.  Note
// the async becuase the deleteIssue function is
// asunchronous and my take a while to complete/
issuesRouter.delete('/:id', async (req,res,next) => {

	try {
		// try the promise and wait for it to return
		const results = await db.deleteIssue(req.issueReturned.id);
		// return the results
		return res.status(204).send();
	} catch (e) {
		// send the error to the error handler middle-ware
		next(e)
	}

});