/*
Base router, pull other routers in from here
*/

// set up express
const express = require('express');
const apiRouter = express.Router();

// set up routers
const artistsRouter = require('./artists');
const seriesRouter = require('./series');
//const issuesRouter = require('./issues');
apiRouter.use('/artists', artistsRouter);
apiRouter.use('/series', seriesRouter);
//apiRouter.use('/series/:id/issues', issuesRouter);
module.exports = apiRouter;