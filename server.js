// Global variables
const express = require('express');
const path = require('path');
const PORT = 3001;

const app = express();
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');
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

// Delete request to remove a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((notes) => {
            // Use filter to create a new array without the note with the given id
            const updatedNotes = notes.filter((note) => note.id !== noteId);

            // Write the updated notes array back to the file
            return writeToFile("./db/db.json", updatedNotes);
        })
        .then(() => {
            res.json(`Note with id ${noteId} deleted successfully`);
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal server error" });
        });
});


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);