import React, { useContext, useEffect, useRef, useState } from 'react';
import NotesItem from './NotesItem';
import AddNote from './AddNote';
import NoteContext from './context/notes/NoteContext';
import {useNavigate} from 'react-router-dom'
const Notes = (props) => {
  let navigate = useNavigate();
  const context = useContext(NoteContext);  // Get the context
  const { note, getAllNotes, edit } = context;  // Destructure to get the notes array from context
  const host = `http://localhost:5000`;
  const { showAlert } = props;
  useEffect(() => {
    if(localStorage.getItem('token')){
      getAllNotes();
    }
    else{
      navigate('/login')
    }
    
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const [currentNote, setCurrentNote] = useState({ id: "", title: "", description: "", tag: "default" });
  const [notesList, setNotesList] = useState([]);  

  const updateNote = (note) => {
    ref.current.click();
    setCurrentNote({
      id: note._id,
      title: note.title,
      description: note.description,
      tag: note.tag
    });
  }
  const onChange = (e) => {
    setCurrentNote({ ...currentNote, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    refClose.current.click();
    setCurrentNote({
      id: note._id,
      title: note.title,
      description: note.description,
      tag: note.tag
    });

    // Create a new note object (deep copy of currentNote) using JSON.stringify and JSON.parse
    const newNote = JSON.parse(JSON.stringify(currentNote));

    try {
      const response = await fetch(`${host}/api/notes/updatenote/${newNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token'),
        },
        body: JSON.stringify({
          title: newNote.title,  // Use the newNote object properties
          description: newNote.description,
          tag: newNote.tag
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const json = await response.json();


      let newNotes = JSON.parse(JSON.stringify(notesList));
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === newNote.id) {
          newNotes[index].title = newNote.title;
          newNotes[index].description = newNote.description;
          newNotes[index].tag = newNote.tag;
          break;
        }

      }

      setNotesList(newNotes);  // Update state with the modified array of notes
      props.showAlert("Note Updated successfully","success")
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };



  return (
    <>
      <AddNote showAlert={showAlert} />


      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Here</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input type="text" className="form-control" id="title" name="title" value={currentNote.title} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="description" name="description" value={currentNote.description} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="tag" name="tag" value={currentNote.tag} onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Your Notes</h2>
        {note.map((note) => {
          return <NotesItem key={note._id} updateNote={updateNote} note={note} showAlert={showAlert} />;
        })}
      </div>
    </>
  );
}

export default Notes;
