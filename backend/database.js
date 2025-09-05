// Loads the SQLite3 library to interact with SQLite databases
// Enables verbose mode for detailed logging of errors and operations
const sqlite3 = require('sqlite3').verbose();

// Creates or opens the database file named 'library.db'
// db is the database object used for executing SQL commands
const db = new sqlite3.Database('./library.db');

// Creates the 'books' table if it doesn't already exist
// The table has four columns: id, title, author, and copies
// id is the primary key and auto-increments with each new entry
// title and author are text fields that cannot be null
// copies is an integer field that cannot be null
db.serialize(() => { // serialize ensures that the commands are executed in order
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      copies INTEGER NOT NULL
    )
  `);
});

// Runs an SQL query to count the number of entries in the 'books' table
db.get('SELECT COUNT(*) as count FROM books', (err, row) => { // db.get is used for queries that return a single row so here it will return the count of rows in the table or an error if something goes wrong
    if (row.count === 0) { // If the count is zero, it means the table is empty
        // Inserts five book entries into the 'books' table
        db.run(`INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`, ["1984", "George Orwell", 4]); // The ? are placeholders for the values to be inserted, which helps prevent SQL injection attacks
        db.run(`INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`, ["To Kill a Mockingbird", "Harper Lee", 2]);
        db.run(`INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`, ["The Great Gatsby", "F. Scott Fitzgerald", 5]);
        db.run(`INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`, ["Pride and Prejudice", "Jane Austen", 3]);
        db.run(`INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`, ["The Catcher in the Rye", "J.D. Salinger", 4]);
    }
});

// Exports the database object for use in other files
module.exports = db;