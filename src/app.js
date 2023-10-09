const express = require("express");
const app = express();

const notes = require("./data/notes-data");

// allows us to work with JSON data sent in HTTP requests
app.use(express.json());

app.get("/notes/:noteId", (req, res) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  // if noteId does NOT match and existing note
  if (foundNote === undefined) {
    res.status(400).send(`Note id not found: ${noteId}`);
  } else {
    // if noteId matches an existing route, respond with the note
    res.json({ data: foundNote });
  }
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

// TODO: Add ability to create a new note
// since some Ids may be used, find largest Id in use
let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);

app.post('/notes', (req, res, next) => {
  const { data: { text } = "" } = req.body;
  if (text) {
    const newNote = {
      // increment from last Id and assign
      id: ++lastNoteId,
      text,
    };
    notes.push(newNote);
    // respond with a 201 status code and the new note
    res.status(201).json({ data: newNote });
  } else {
    // respond with a 400 status if req.body does not contain a data property
    res.sendStatus(400);
  }
});

// TODO: Add not-found handler
// if route is not defined, respond with a 400 status and message 
app.use((req, res, next) => {
  res.status(400).send(`Not found: ${req.originalUrl}`);
  next();
});

// TODO: Add error handler
// return a 400 status code if the text property is missing
app.use((err, req, res, next) => {
  res.sendStatus(400);
});

module.exports = app;
