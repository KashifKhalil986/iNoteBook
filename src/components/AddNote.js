import React, { useContext, useState } from 'react';
import NoteContext from "./context/notes/NoteContext";

const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;
    const {showAlert} = props;
    const [note, setNote] = useState({ title: "", description: "", tag: "default" });

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);

        // Reset the form fields after adding the note
        setNote({ title: "", description: "", tag: "" });
        props.showAlert("Note added successfully","success")
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <div className="container my-3">
            <h2>Add Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={note.title} onChange={onChange} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} />
                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    );
};

export default AddNote;
