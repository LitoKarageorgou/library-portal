const express = require('express');
const db = require("./database");
const app = express();
const PORT = 3001;
const cors = require("cors");

app.use(express.json());
app.use(cors());

// ===== Root route =====

// Basic check to confirm the backend is running
app.get('/', (req, res) => {
  res.send('Library Portal Backend is running');
});

// ===== Books routes =====

// Get all books
app.get('/books', (req, res) => {
  db.all("SELECT * FROM books", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new book
app.post('/books', (req, res) => {
  const { title, author, copies } = req.body;
  db.run(
    `INSERT INTO books (title, author, copies) VALUES (?, ?, ?)`,
    [title, author, copies],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, author, copies });
    }
  );
});

// Update book by id
app.put('/books/:id', (req, res) => {
  const { title, author, copies } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE books SET title = ?, author = ?, copies = ? WHERE id = ?`,
    [title, author, copies, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Book not found" });
      res.json({ id, title, author, copies });
    }
  );
});

// Delete book by id
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  db.run(
    `DELETE FROM books WHERE id = ?`,
    id,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Book not found" });
      res.json({ message: "Book deleted successfully" });
    }
  );
});

// ===== Students routes =====

// Get all students
app.get('/students', (req, res) => {
  db.all("SELECT * FROM students", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new student
app.post('/students', (req, res) => {
  const { name, email, class: studentClass } = req.body;
  db.run(
    `INSERT INTO students (name, email, class) VALUES (?, ?, ?)`,
    [name, email, studentClass],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, email, class: studentClass });
    }
  );
});

// Update student by id
app.put('/students/:id', (req, res) => {
  const { name, email, class: studentClass } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE students SET name = ?, email = ?, class = ? WHERE id = ?`,
    [name, email, studentClass, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
      res.json({ id, name, email, class: studentClass });
    }
  );
});

// Delete student by id
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  db.run(
    `DELETE FROM students WHERE id = ?`,
    id,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
      res.json({ message: "Student deleted successfully" });
    }
  );
});

// ===== Borrowings routes =====

// Get all borrowings
app.get('/borrowings', (req, res) => {
  db.all(
    `SELECT borrowings.*, students.name AS student_name, books.title AS book_title
     FROM borrowings
     JOIN students ON borrowings.student_id = students.id
     JOIN books ON borrowings.book_id = books.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Add a new borrowing (student borrows a book)
app.post('/borrowings', (req, res) => {
  const { student_id, book_id } = req.body;

  // Check how many active borrowings the student has
  db.get(
    `SELECT COUNT(*) as count FROM borrowings WHERE student_id = ? AND returned_at IS NULL`,
    [student_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row.count >= 3) return res.status(400).json({ error: "Student already has 3 borrowed books" });

      // Check available copies for the book
      db.get(`SELECT copies FROM books WHERE id = ?`, [book_id], (err, book) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!book || book.copies <= 0) return res.status(400).json({ error: "No available copies of this book" });

        // Insert borrowing with due_date = 30 days from now
        const due_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        db.run(
          `INSERT INTO borrowings (student_id, book_id, due_date) VALUES (?, ?, ?)`,
          [student_id, book_id, due_date],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Decrease book copies
            db.run(
              `UPDATE books SET copies = copies - 1 WHERE id = ?`,
              [book_id],
              (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({
                  id: this.lastID,
                  student_id,
                  book_id,
                  borrowed_at: new Date().toISOString(),
                  due_date,
                  returned_at: null
                });
              }
            );
          }
        );
      });
    }
  );
});

// Return a borrowed book
app.put('/borrowings/:id/return', (req, res) => {
  const { id } = req.params;

  // Mark borrowing as returned
  db.run(
    `UPDATE borrowings SET returned_at = datetime('now') WHERE id = ? AND returned_at IS NULL`,
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Borrowing not found or already returned" });

      // Increase book copies back
      db.run(
        `UPDATE books SET copies = copies + 1 WHERE id = (SELECT book_id FROM borrowings WHERE id = ?)`,
        [id],
        function (err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Book returned successfully" });
        }
      );
    }
  );
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});