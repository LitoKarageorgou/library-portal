const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./library.db');

db.serialize(() => {
  // Create Books table
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      copies INTEGER NOT NULL
    )
  `);

  // Create Students table
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      class TEXT
    )
  `);

  // Create Borrowings table
  db.run(`
    CREATE TABLE IF NOT EXISTS borrowings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      borrowed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      due_date DATETIME,
      returned_at DATETIME,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(book_id) REFERENCES books(id)
    )
  `);
});

// Insert sample books if table is empty
db.get('SELECT COUNT(*) as count FROM books', (err, row) => {
  if (row.count === 0) {
    db.run(
      `INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`,
      ["1984", "George Orwell", 4]
    );
    db.run(
      `INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`,
      ["To Kill a Mockingbird", "Harper Lee", 2]
    );
    db.run(
      `INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`,
      ["The Great Gatsby", "F. Scott Fitzgerald", 5]
    );
    db.run(
      `INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`,
      ["Pride and Prejudice", "Jane Austen", 3]
    );
    db.run(
      `INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`,
      ["The Catcher in the Rye", "J.D. Salinger", 4]
    );
  }
});

// Insert sample students if table is empty
db.get('SELECT COUNT(*) as count FROM students', (err, row) => {
  if (row.count === 0) {
    db.run(
      `INSERT INTO students (name, email, class) VALUES (?, ?, ?)`,
      ["Alice Johnson", "alice@example.com", "A1"]
    );
    db.run(
      `INSERT INTO students (name, email, class) VALUES (?, ?, ?)`,
      ["Bob Smith", "bob@example.com", "B2"]
    );
    db.run(
      `INSERT INTO students (name, email, class) VALUES (?, ?, ?)`,
      ["Charlie Brown", "charlie@example.com", "C3"]
    );
  }
});

module.exports = db;
