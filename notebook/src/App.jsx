import { useEffect, useRef } from 'react'
import { useState } from 'react'
import noteService from './services/notes'
import Notification from './components/Notification'
import { Footer } from './components/Footer'
import { Note } from './components/Note'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

export default function App() {
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [showALl, setShowAll] =useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)})
  },[])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const showError =(text) => {
    setErrorMessage(text)
    setTimeout(() => setErrorMessage(null),4000)
  }

  const addNote =(noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject, user.token)
      .then(newObject => {
        setNotes(notes.concat(newObject))
      })
      .catch(err => {
        showError(err.response?.data?.error)
      })
  }

  const toggleImportanceOf =(id) => {
    const note= notes.find(note => note.id ===id)
    if(!note) return

    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(updatedNote => {
        // console.log("Response from server:", updatedNote)
        setNotes(prevNotes =>
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
    <Togglable label='new note' ref={noteFormRef}>
      <NoteForm createNote = {addNote} showError={showError} />
    </Togglable>
  )

  const loginForm = () => (
    <Togglable label ="Login">
      <LoginForm setUser={setUser} showError={showError}/>
    </Togglable>
  )
  return (
    <div className='note-container'>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>

      {
        user === null
          ? <>
            {loginForm()}
          </>
          : <>
            <h2>{user.name} logged-in</h2>
            {noteForm()}
          </>
      }

      <button onClick={() => setShowAll(!showALl)}>Show {showALl ? 'important' : 'all'}</button>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>)}
      </ul>

      <Footer/>
    </div>
  )
}

