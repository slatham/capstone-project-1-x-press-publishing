const db = require('./sql')

// set up the router
const issuesRouter = require('express').Router({mergeParams:true});


issuesRouter.get('/', async (req,res,next) => {
	
	try {
		const seriesId = req.seriesReturned.id;
		// try the promise and wait for it to return
		const results = await db.getAllIssuesBySeriesId(seriesId);
		// return the results
		console.log(results);
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

module.exports = issuesRouter;