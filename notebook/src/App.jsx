import React, { useEffect } from 'react'
import { useState } from 'react'
import noteService from "./services/notes"
import login from './services/login'
import Notification from './components/Notification'
import { Footer } from './components/Footer'
import { Note } from './components/Note'

export default function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showALl, setShowAll] =useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(()=>{
    noteService
      .getAll()
      .then(initialNotes=>{
        setNotes(initialNotes)})
  },[])

  const showError =(text)=>{
    setErrorMessage(text)

    setTimeout(()=>setErrorMessage(null),4000)
  }
  const handleNoteChange =event => setNewNote(event.target.value)
  const handleLogin = async(event) => {
    event.preventDefault()
    console.log(`Logging ${username} with password ${password}`)

    const newUser = {
      username,
      password
    }
    try {
      const savedUser = await login(newUser)
      setUser(savedUser)
      noteService.setToken(savedUser.token)
      setUserName('')
      setPassword('')
    } catch (error) {
      showError(error.response?.data?.error)
    }

    
  }

  const addNote = (event)=>{
    event.preventDefault()
    if(newNote.trim().length < 5){
      showError("content should be at least 5 characters")
      return 
    }
    const noteObject ={
      content: newNote,
      important: Math.random() <0.5
    }
    noteService
      .create(noteObject, user.token)
      .then(newObject=>{
        setNotes(notes.concat(newObject))
        setNewNote("")
      })
      .catch(err=>{
        showError(err.response?.data?.error)
      })
  }  
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
        showError(`The note '${note.content}' is not in database`)

        //Handle BOTH 404 (Not Found) AND 400 (CastError / Malformatted ID)
        if (err.response?.status === 404 || err.response?.status === 400) {
          setNotes(prevNotes => prevNotes.filter(n => n.id !== id))
        }
        
      })
  }

  const notesToShow = showALl? notes : notes.filter(note => note.important)


  const noteForm = () => (
    <form onSubmit={addNote}>
      <input placeholder='add a new note...' value={newNote} onChange={handleNoteChange}/>
      <button type='submit'>Save</button>
    </form>
  )

  const loginForm = () => {
    return <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="Username">Username: </label>
        <input type="text" value={username}
          onChange={({target}) => setUserName(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input type="password" 
          value={password} 
          onChange={({target}) => setPassword(target.value)} 
        />
      </div>
      <button type='submit' style={{backgroundColor: 'light-green'}}>Login</button>
    </form>
  }
  return (
    <div className='note-container'>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      
      {
        user === null 
          ? <>
              <h2>Login</h2>
             { loginForm()}
            </>
          : <>
              <h2>{user.name} logged-in</h2>
              {noteForm()}
            </>    
      }
      
      <button onClick={()=> setShowAll(!showALl)}>Show {showALl ? "important" : "all"}</button>
      <ul>
        {notesToShow.map(note =><Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>)}
      </ul>
     
      <Footer/>
    </div>
  )
}

