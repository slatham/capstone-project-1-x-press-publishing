const db = require('./sql')

// set up the router
const issuesRouter = require('express').Router({mergeParams:true});

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


issuesRouter.get('/', async (req,res,next) => {
	
	try {
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


issuesRouter.post('/', async (req,res,next)=>{

	try {
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

issuesRouter.put('/:id', async (req,res,next) =>{

	try {
		
		const results = await db.updateIssue(req.body,req.issueReturned.id);
		return res.status(200).json({issue: results});
	} catch (e) {

		next(e);
	}



});

module.exports = issuesRouter;