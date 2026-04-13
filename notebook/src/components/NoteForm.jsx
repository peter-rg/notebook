import { useState } from "react"
const NoteForm = ({createNote, showError}) => {
  const [newNote, setNewNote] = useState("")

  const addNote = (event)=>{
    event.preventDefault()

    if(newNote.trim().length < 5){
      showError("content should be at least 5 characters")
      return 
    }
    createNote({
      content: newNote,
      important: true
    })
    setNewNote("")
  }  
  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input placeholder='add a new note...' 
          value={newNote} onChange={({target}) => setNewNote(target.value)}
        />
        <button type='submit'>Save</button>
      </form>
    </div>
   
  )
}
  export default NoteForm