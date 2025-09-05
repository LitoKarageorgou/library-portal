// Loads the express framework into the project
const express = require('express');

// Creates the application object upon which routes are defined
const app = express();

// Sets the port where the server will run
const PORT = 3001;

// When a GET request is made to the root route, send "Hello world from the backend!" as a response
app.get('/', (req, res) => {
    res.send('Hello world from the backend!');
}
);

// Starts the server and listens to the 3001 port
app.listen(PORT,() => { // opens the 3001 port and then runs the callback function
    console.log(`Server running on http://localhost:${PORT}`); // callback function, executed once the server is successfully running
})