// Global variables
const express = require('express');
const path = require('path');
const PORT = 3001;

const app = express();
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');


app.use(express.json());
app.use(express.static('public'));

// Get Route for landing page
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


// Get Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


// Get Route for retrieving notes information
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Post request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    if(req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);

    }else{
        res.error(`Error in adding note`);
    }
});


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);