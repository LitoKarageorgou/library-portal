// Loads the express framework into the project
const express = require('express');

// Imports the database object from the database.js file
const db =  require("./database");

// Creates the application object upon which routes are defined
const app = express();

// Sets the port where the server will run
const PORT = 3001;

// When a GET request is made to the root route, send "Hello world from the backend!" as a response
app.get('/', (req, res) => {
    res.send('Hello world from the backend!');
}
);

// When a GET request is made to the /books route, send all book entries from the database as a JSON response
app.get('/books', (req, res) => { // When a request is made to the /books route run the following callback function
    db.all("SELECT * FROM books", (err, rows) => { // Runs the SQL query to select all entries from the books table
         // The callback function is executed once the database query is complete
        if (err) {
            res.status(500).json({ error: err.message }); // If there is an error, send a 500 status code (Internal Server Error) and the error message as a JSON response
            return; // Stops the function execution
        }
        res.json(rows); // If no error, send the rows as a JSON response
    });
});


// Starts the server and listens to the 3001 port
app.listen(PORT,() => { // opens the 3001 port and then runs the callback function
    console.log(`Server running on http://localhost:${PORT}`); // callback function, executed once the server is successfully running
})