import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = `http://localhost:5000`;
  const initialNote = [];
  const [note, setNote] = useState(initialNote);

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
      });
      if (!response.ok) throw new Error("Network response was not ok"); // Handle non-200 status
      const json = await response.json();
      setNote(json);
 
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const json = await response.json();
      setNote(note.concat(json)); // Concatenate the new note to the state
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };
  // Edit a note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag }),
      });
  
      if (!response.ok) throw new Error("Network response was not ok");
  
      const json = await response.json(); // Await the response to get the updated note
  
      // Logic to edit a note
      console.log("Current note state:", note);

      const updatedNotes = note.filter((n) =>
        n._id === id ? { ...n, title, description, tag } : n
      );
  
      setNote(updatedNotes); // Update state with the new array of notes
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  

  // Delete a note

const deleteNote = async (id) => {
  try {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
    });
    if (!response.ok) throw new Error("Network response was not ok"); // Handle non-200 status

    // Remove the deleted note from state
    const newNotes = note.filter((note) => note._id !== id);
    setNote(newNotes); // Update state with the new array of notes

  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

  

  return (
    <NoteContext.Provider value={{ note, addNote, deleteNote, editNote,  getAllNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
