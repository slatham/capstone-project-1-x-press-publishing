const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// run one command after another.  This makes sure dropping the table completes
// before trying to create it again
db.serialize(() => {

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
// TODO - Add foreign key constraints and set the ON UPDATE and ON DELETE actions
db.run(`CREATE TABLE Issue (
				id INTEGER PRIMARY KEY NOT NULL,
				name TEXT NOT NULL,
				issue_number TEXT NOT NULL,
				publication_date TEXT NOT NULL,
				artist_id INTEGER NOT NULL,
				series_id INTEGER NOT NULL
		)`, (err) => {
					if (err) {throw err}
					console.log('Issue table created');
});






});