import React, { useEffect } from 'react'
import { useState } from 'react'
import noteService from "./services/notes"
import Notification from './components/Notification'
import { Footer } from './components/Footer'
import { Note } from './components/Note'

export default function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showALl, setShowAll] =useState(false)
  const [errorMessage, setErrorMessage] = useState('some error happened')

  useEffect(()=>{
    noteService
      .getAll()
      .then(initialNotes=>{
        setNotes(initialNotes)})
  },[])

  const addNote = (event)=>{
    event.preventDefault()
    const noteObject ={
      content: newNote,
      important: Math.random() <0.5
    }
    noteService
      .create(noteObject)
      .then(newObject=>setNotes(notes.concat(newObject)))
    setNewNote("")
  }
  const handleNoteChange =event => setNewNote(event.target.value)
  
  const toggleImportanceOf =(id)=>{
    const note= notes.find(note => note.id ===id)
    if(!note) return

    const changedNote = {...note, important: !note.important}
    noteService
      .update(id, changedNote)
      .then(updatedNote=>{
        // console.log("Response from server:", updatedNote)
        setNotes(prevNotes=>
          prevNotes.map(note => note.id === id ? updatedNote: note)
        )
      })
      .catch(err => {
        // console.error("Update failed", err)
        setErrorMessage(`The note '${note.content}' is not in server`)

        setTimeout(()=>{
          setErrorMessage(null)
        },5000)

        if(err.response?.status === 404){
          setNotes(prevNotes=>
            prevNotes.filter(note => note.id !== id)
          )

        }
        
      })
  }

  const notesToShow = showALl? notes : notes.filter(note => note.important)

  return (
    <React.Fragment>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <button onClick={()=> setShowAll(!showALl)}>Show {showALl ? "important" : "all"}</button>
      <ul>
        {notesToShow.map(note =><Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>)}
      </ul>
      <form onSubmit={addNote}>
        <input placeholder='add a new note...' value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>Save</button>
      </form>
      <Footer/>
    </React.Fragment>
  )
}

