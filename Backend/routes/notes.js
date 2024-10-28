const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/Fetchuser');
const { check, validationResult } = require('express-validator');
const Notes = require('../models/Notes');

// Route 1: Get all notes using GET /api/auth/fetchallnotes (login required)
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 2: Add a new note using POST /api/auth/addnote (login required)
router.post('/addnote', fetchuser, [
    check('title', 'Title should be at least 3 characters long').isLength({ min: 3 }),
    check('description', 'Description should be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    const { title, description, tag } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });

        // Save the note to the database
        const saveNote = await note.save();

        // Return the saved note as the response
        res.json(saveNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});
 // Route 3: Update an existing note using PUT /api/auth/updatenote/:id (login required)
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    
    // Create a newNote object based on the fields to be updated
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    try {
        // Find the note by its ID
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Check if the logged-in user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        // Update the note with new data
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

        // Send the updated note as a response
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 4: Delete an existing note using Delete /api/auth/deleteenote/:id (login required)
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note by its ID
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Check if the logged-in user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        // Update the note with new data
        note = await Notes.findByIdAndDelete(req.params.id);

        res.json({Success:"Note has been deleted",note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

    module.exports = router;
  