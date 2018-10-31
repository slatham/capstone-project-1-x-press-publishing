/*
Base router, pull other routers in from here
*/

// set up express
const express = require('express');
const apiRouter = express.Router();

// set up routers
const artistsRouter = require('./artists');
const seriesRouter = require('./series');
apiRouter.use('/artists', artistsRouter);
apiRouter.use('/series', seriesRouter);
module.exports = apiRouter;