/*
Used to create the database tables.
Run manually with node migration.js
*/

// set up sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// can turn off journalling while we're developing
// change some options for speed while we're developing
db.run('pragma journal_mode=off');
db.run('pragma temp_store = 2');
db.run('pragma SYNCHRONOUS = off');
db.run('PRAGMA foreign_keys = ON');

// run one command after another.  This makes sure dropping the table completes
// before trying to create it again
db.serialize(() => {

// disable foreign key support so we can drop the table
db.run('PRAGMA foreign_keys = OFF');

// ----- First we'll freshen up the current database
	// drop the Artist table
	db.run('DROP TABLE IF EXISTS Artist', (err) => {
		if(err){ throw err }
		console.log('Dropped Artist table')
	});
	// drop the Series table
	db.run('DROP TABLE IF EXISTS Series', (err) => {
		if(err){ throw err }
		console.log('Dropped Series table')
	});
	// drop the Issue table
	db.run('DROP TABLE IF EXISTS Issue', (err) => {
		if(err){ throw err }
		console.log('Dropped Issue table')
	});

// ----- Next we'll create the tables
// Create the Artist Table
db.run(`CREATE TABLE Artist (
				id INTEGER PRIMARY KEY NOT NULL,
				name TEXT NOT NULL,
				date_of_birth TEXT NOT NULL,
				biography TEXT NOT NULL,
				is_currently_employed INTEGER DEFAULT 1
		)`, (err) => {
					if (err) {throw err}
					console.log('Artist table created');
});
// Create the Series Table
db.run(`CREATE TABLE Series (
				id INTEGER PRIMARY KEY NOT NULL,
				name TEXT NOT NULL,
				description TEXT NOT NULL
		)`, (err) => {
					if (err) {throw err}
					console.log('Series table created');
});
// Create the Issue Table
// Notice the foreign key definitions on artist_id and series_id
// if the artist is deleted, but there are still issues under their name,
// the delete should be restricted
// if the id for the artist or series changes, update the value here too.
db.run(`CREATE TABLE Issue (
				id INTEGER PRIMARY KEY NOT NULL,
				name TEXT NOT NULL,
				issue_number TEXT NOT NULL,
				publication_date TEXT NOT NULL,
				artist_id INTEGER NOT NULL,
				series_id INTEGER NOT NULL,
				FOREIGN KEY (artist_id) REFERENCES Artist(id),
				FOREIGN KEY (series_id) REFERENCES Series(id)
		)`, (err) => {
					if (err) {throw err}
					console.log('Issue table created');
});

});





