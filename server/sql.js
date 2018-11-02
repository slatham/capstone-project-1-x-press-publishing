// set up sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// db function to return all artists
// this is an example of how to handle
// async operations with callbacks.
const getAllWorkingArtists =  (callback) => {

	 db.all('SELECT * FROM Artist WHERE is_currently_employed = 1',  (err,rows) => {
		// if there's an error raise it 
		// attach some info and send it to the error handler middle-ware
		if(err) {
			// create a new error object
			const error = new Error('Artist Not Found');
			error.status = 404;	// set error status
			error.body = err;	// set error body
			return next(error);	// send the error on to the next middle-ware
								// eventually it'll reach the error handler 
		}
		
		// run the callback function with
		// the rows
		callback(rows)
	});
};

// db function 
const getAllSeries = () => {
return new Promise ((resolve, reject) => {
	db.all('SELECT * FROM Series',(err,rows) => {
			// if there's an error raise it 
			// attach some info and send it to the error handler middle-ware
			if(err) {
				// create a new error object
				const error = new Error('Series Not Found');
				error.status = 404;	// set error status
				error.body = err;	// set error body
				return next(error);	// send the error on to the next middle-ware
									// eventually it'll reach the error handler 
			}
			// all is well send back the results
			resolve(rows)
		});
});
}


const getArtistById = (table,id) => {

	return new Promise ((resolve,reject) => {

		db.get('SELECT * FROM Artist WHERE id = $id',{
			
			$id : id


		},(err,row) => {

			if(err) {
				throw new Error(err);
			}


			resolve(row);

		});

	});
}

const addNewArtist = (post) => {
	
	return new Promise ((resolve,reject) => {

		db.run('INSERT INTO Artist (name,date_of_birth,biography,is_currently_employed) \
							VALUES ($name,$date_of_birth,$biography,$is_currently_employed)',{
			
			$name : post.artist.name,
			$date_of_birth : post.artist.dateOfBirth,
			$biography : post.artist.biography,
			$is_currently_employed : post.artist.isCurrentlyEmployed

		},function (err) {

			if(err) {
				throw new Error(err);
			}

			// get the new artist with this.lastID
			db.get('SELECT * FROM Artist where id = $id', { $id : this.lastID },function(err,row){


				if(err) {
					throw new Error(err);
				}


				resolve(row);


			});


			

		});

	});
}

const deleteArtist = (id) => {

	return new Promise ((resolve,reject) => {

		db.run('UPDATE Artist SET is_currently_employed = 0 WHERE id = $id',{
			
			$id : id

		},(err) => {

			if(err) {
				throw new Error(err);
			}

			db.get('SELECT * FROM Artist WHERE id = $id', { $id : id }, (err,row) =>{
			if(err) {
				throw new Error(err);
			}

				resolve(row);
			});
			

		});

	});
}

const updateArtist = (put,id) => {

	return new Promise ((resolve,reject) => {

		db.run('UPDATE Artist SET name = $name, \
								date_of_birth = $date_of_birth, \
								biography = $biography \
				WHERE id = $id',{ 
								
							$name : put.artist.name,
							$date_of_birth : put.artist.dateOfBirth,
							$biography : put.artist.biography,
							$id : id


		},(err) => {

			if(err) {
				throw new Error(err);
			}

			db.get('SELECT * FROM Artist WHERE id = $id', { $id : id }, (err,row) =>{
			if(err) {
				throw new Error(err);
			}

				resolve(row);
			});
			

		});

	});
}

module.exports = { getAllWorkingArtists, getAllSeries, getArtistById, addNewArtist, deleteArtist, updateArtist };