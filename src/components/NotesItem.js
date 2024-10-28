import React, { useContext } from 'react';  // Import useContext
import NoteContext from "./context/notes/NoteContext";

const NotesItem = (props) => {
  const context = useContext(NoteContext);  // Use useContext to get the context
  const { note,updateNote ,showAlert } = props;  // Get the note from props
  const { deleteNote } = context;  // Destructure deleteNote from the context

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note);}}></i>
          <i
  className="fa-solid fa-trash-can mx-2" onClick={() => {deleteNote(note._id); props.showAlert("Deleted successfully", "success");}}></i>

        </div>
      </div>
    </div>
  );
}

export default NotesItem;
