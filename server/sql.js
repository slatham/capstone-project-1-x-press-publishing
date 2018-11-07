// File contains all function to interact with the database

// set up sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// db function to return all artists.
// this is an example of how to handle
// async operations with callbacks - rather than promises
// that are used in the rest of the code.
// notice this function takes a callback function as its parameter
const getAllWorkingArtists =  (callback) => {
	// run the db select
	db.all('SELECT * FROM Artist WHERE is_currently_employed = 1',  (err,rows) => {
		// if there's an error raise it 
		// attach some info and send it back to the callback function
		// first define an error variable
		let error = false
		// if there was an error
		if(err) {
			// create a new error object
			error = new Error('Artist Not Found');
			error.status = 404;	// set error status
			error.body = err;	// set error body
			
		}		
		// run the callback function with
		// the rows passed as the parameter
		// if there was an error, the error is also passed back
		callback(error, rows)
	});
};

// db function to return all series from the
// database
const getAllSeries = () => {
// setup and return a promise
return new Promise ((resolve, reject) => {
	// run the async db function to get all series from the database
	db.all('SELECT * FROM Series',(err,rows) => {
			// if there's an error raise it, 
			// attach some info to the error
			if(err) {
				// create a new error object
				const error = new Error('Series Not Found');
				error.status = 404;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}
			// all is well send back the results
			resolve(rows)
		});
});
}

// get something from the database by id and model type
const getById = (model, id) => {
	// set up and return a new promise
	return new Promise ((resolve,reject) => {
		// crate a sql variable to use in the db query
		const sql = `SELECT * FROM ${model} WHERE id = ${id}`;
		// run the async db query
		db.get(sql,(err,row) => {
			// if there was an error set it up
			if(err) {
				// create a new error object
				const error = new Error('Not Found');
				error.status = 404;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}
			// all is well resolve the promise by sending back the data
			resolve(row);
		});

	});
}

// add an artist to the database taking a POST
// request.  The POST is the req.body and is handled
// by the body parser middle-ware
const addNewArtist = (post) => {
	// set up the promise
	return new Promise ((resolve,reject) => {
		// run the async function to insert the artist into the db
		db.run('INSERT INTO Artist (name,date_of_birth,biography,is_currently_employed) \
							VALUES ($name,$date_of_birth,$biography,$is_currently_employed)',{
			
			$name : post.artist.name,
			$date_of_birth : post.artist.dateOfBirth,
			$biography : post.artist.biography,
			$is_currently_employed : post.artist.isCurrentlyEmployed

			// Note we can't use arrow functions if we
			// want to use this.lastID
		},function (err) {

			if(err) {
				// create a new error object
				const error = new Error('Artist Not Added');
				error.status = 404;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}

			// get the newly created artist with this.lastID
			db.get('SELECT * FROM Artist where id = $id', { $id : this.lastID },function(err,row){ 

				if(err) {
					// create a new error object
					const error = new Error('New Artist Not Found');
					error.status = 404;	// set error status
					error.body = err;	// set error body
					return reject(error);	// reject the promise and send back the error
				}
				// send back the newly created artist
				resolve(row);

			});

		});

	});
}

// and a new series to the database from a POST request
// POST req.body is taken as the parameter.  POST is handled
// by the body-parser middle-ware
const addNewSeries = (post) => {
	// set up and return the promise
	return new Promise ((resolve,reject) => {
		// run the async db function
		db.run('INSERT INTO Series (name,description) \
							VALUES ($name,$description)',{
			$name : post.series.name,
			$description : post.series.description,
		},function (err) {

			if(err) {
				// create a new error object
				const error = new Error('Series Not Added');
				error.status = 400;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}
			// get the new series with this.lastID
			db.get('SELECT * FROM Series where id = $id', { $id : this.lastID },function(err,row){

				if(err) {
					// create a new error object
					const error = new Error('New Series Not Found');
					error.status = 404;	// set error status
					error.body = err;	// set error body
					return reject(error);	// reject the promise and send back the error
				}
				// return the newly created series by resolving the
				// promise.
				resolve(row);
			});			

		});

	});
}

// function to delete an artist from the database
const deleteArtist = (id) => {
	// set up the promise
	return new Promise ((resolve,reject) => {
		// run the query on the database
		db.run('UPDATE Artist SET is_currently_employed = 0 WHERE id = $id',{ $id : id },(err) => {

			if(err) {
				// create a new error object
				const error = new Error('Artist Not Deleted');
				error.status = 404;		// set error status
				error.body = err;		// set error body
				return reject(error);	// reject the promise and send back the error
			}

			// return the updated artist
			db.get('SELECT * FROM Artist WHERE id = $id', { $id : id }, (err,row) =>{
			if(err) {
				// create a new error object
				const error = new Error('Deleted Artist Not Found');
				error.status = 404;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}

				resolve(row);
			});
		});

	});
}

// function to update an artist's details.
// takes the PUT request and artist ID
const updateArtist = (put,id) => {
	// set up a promise and return it
	return new Promise ((resolve,reject) => {
		// run the async function 
		db.run('UPDATE Artist SET name = $name, \
								date_of_birth = $date_of_birth, \
								biography = $biography \
				WHERE id = $id',{ 
								
							$name : put.artist.name,
							$date_of_birth : put.artist.dateOfBirth,
							$biography : put.artist.biography,
							$id : id

		// if there's an error reject the promise
		},(err) => {

			if(err) {
				// create a new error object
				const error = new Error('Artist Not Updated');
				error.status = 400;		// set error status
				error.body = err;		// set error body
				return reject(error);	// reject the promise and send back the error
			}

			// get the updated artist
			db.get('SELECT * FROM Artist WHERE id = $id', { $id : id }, (err,row) =>{

			if(err) {

				// create a new error object
				const error = new Error('Updated Artist Not Found');
				error.status = 404;		// set error status
				error.body = err;		// set error body
				return reject(error);	// reject the promise and send back the error

			}
				// send back the updated artist
				resolve(row);
			});

		});

	});
}

// function to update the series.  Takes the body from a 
// put request that's parsed by the body-parser middle-ware
// and the series id as parameters
const updateSeries = (put,id) => {

	return new Promise ((resolve,reject) => {

		db.run('UPDATE Series SET name = $name, \
								description = $description \
				WHERE id = $id',{ 
								
							$name : put.series.name,
							$description : put.series.description,
							$id : id

		},(err) => {

			if(err) {
				// create a new error object
				const error = new Error('Series Not Updated');
				error.status = 400;		// set error status
				error.body = err;		// set error body
				return reject(error);	// reject the promise and send back the error
			}

			// get the newly update series
			db.get('SELECT * FROM Series WHERE id = $id', { $id : id }, (err,row) =>{
			if(err) {

				// create a new error object
				const error = new Error('Newly Updated Series Not Found');
				error.status = 404;		// set error status
				error.body = err;		// set error body
				return reject(error);	// reject the promise and send back the error

			}
				// resolve the promise
				resolve(row);
			});
		});

	});
}

// get all the issues for a given series
const getAllIssuesBySeriesId = (id) => {
	// set up and return the promise
	return new Promise ((resolve,reject) => {
		// run the async db function
		db.all('SELECT * FROM Issue where series_id = $id',{$id : id},(err,row) => {

			if(err) {
				// create a new error object
				const error = new Error('Issues Not Found');
				error.status = 404;		// set error status
				error.body = err;		// set error body
				return reject(error);	// reject the promise and send back the error
			}
			// resolve the promise by sending back all the issues
			resolve(row);
		});

	});
}

// function to add a new issue to a series.  Takes the body
// of a POST request (That's handled by the body parser middle-ware),
// and adds it as an issue to a series
const addNewIssue = (post,seriesId) => {
	// set up the promise
	return new Promise ((resolve,reject) => {
		// run the async function
		db.run('INSERT INTO Issue (name,issue_number,publication_date,artist_id,series_id) \
							VALUES ($name,$issue_number,$publication_date,$artist_id,$series_id)',{
			$name : post.issue.name,
			$issue_number : post.issue.issueNumber,
			$publication_date : post.issue.publicationDate,
			$artist_id : post.issue.artistId,
			$series_id : seriesId

		},function (err) {
			// handle any errors
			if(err) {
				// create a new error object
				const error = new Error('Issue Not Added');
				error.status = 400;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}

			// get the new series with this.lastID
			db.get('SELECT * FROM Issue where id = $id', { $id : this.lastID },function(err,row){

				// handle any errors
				if(err) {
					// create a new error object
					const error = new Error('New Issue Not Found');
					error.status = 404;	// set error status
					error.body = err;	// set error body
					return reject(error);	// reject the promise and send back the error
				}
				// send back the newly created issue and resolve the promise
				resolve(row);

			});

		});

	});
}

// function to update an issue in the db from a PUT
// request given the issue id
const updateIssue = (put,id) => {
	// return a promise to do this
	return new Promise ((resolve,reject) => {
		// run the slow async function
		db.run('UPDATE Issue SET name = $name, \
									issue_number = $issue_number,\
									publication_date = $publication_date, \
									artist_id = $artist_id, \
									series_id = $series_id \
				WHERE id = $id',{ 
								
							$name : put.issue.name,
							$issue_number : put.issue.issueNumber,
							$publication_date : put.issue.publicationDate,
							$artist_id : put.issue.artistId,
							$series_id : put.issue.seriesId,
							$id : id

		},(err) => {
			// handle errors
			if(err) {
				// create a new error object
				const error = new Error('Issue Not Updated');
				error.status = 400;		// set error status
				error.body = err;		// set error body
				return reject(error);	// reject the promise and send back the error
			}

			// get the newly updated issue from the db
			db.get('SELECT * FROM Issue WHERE id = $id', { $id : id }, (err,row) =>{
			// handle any error
			if(err) {
				// create a new error object
				const error = new Error('Updated Issue Not Found');
				error.status = 404;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}
				// resolve the promise by sending the
				// updated issue back
				resolve(row);
			});
			
		});

	});
}

// function to delete an issue given its id
const deleteIssue = (id) => {
	// set up a promise to delete the issue
	return new Promise ((resolve,reject) => {
		// run the async query to delete the issue
		db.run('DELETE FROM Issue WHERE id = $id',{
			$id : id
		},(err) => {

			// handle errors
			if(err) {
				// create a new error object
				const error = new Error('Issue Not Deleted');
				error.status = 400;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}
			// resolve the promise without sending
			// anything back.
			resolve()
	
		});

	});
}

// function to delete a series given its id
const deleteSeries = (id) => {
	// set up the promise to delete the series
	return new Promise ((resolve,reject) => {
		// delete the series
		db.run('DELETE FROM Series WHERE id = $id',{
			
			$id : id

		},(err) => {
			// handle any errors
			if(err) {
				// create a new error object
				const error = new Error('Series Not Deleted');
				error.status = 400;	// set error status
				error.body = err;	// set error body
				return reject(error);	// reject the promise and send back the error
			}

			// no errors so resolve the promise and send
			// it back as resolved
			resolve()
			
		});

	});
}

// export the functions to be used elsewhere
module.exports = { getAllWorkingArtists, getAllSeries, getById, addNewArtist, 
					deleteArtist, updateArtist , addNewSeries, updateSeries, 
					getAllIssuesBySeriesId, addNewIssue, updateIssue, 
					deleteIssue, deleteSeries };