const db = require('./sql')

// set up the router
const issuesRouter = require('express').Router({mergeParams:true});


const checkValidInput = (req,res,next) => {
console.log(req.body.issue)
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

	next()


}

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


issuesRouter.post('/', checkValidInput, async (req,res,next)=>{

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

issuesRouter.put('/:id', checkValidInput, async (req,res,next) =>{

	try {
		
		const results = await db.updateIssue(req.body,req.issueReturned.id);
		return res.status(200).json({issue: results});
	} catch (e) {

		next(e);
	}



});

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

module.exports = issuesRouter;