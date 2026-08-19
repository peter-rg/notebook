const Note = require('../models/notes')
const User = require('../models/users')
const notesRouter = require('express').Router()
const { validateNote } = require('../utils/middleware')

notesRouter.get('/', async(req, res) => {
  const notes = await Note.find({})
    .populate(
      'user', { username: 1, name:1 }
    )
  res.status(200).json(notes)
})

notesRouter.get('/:id', async(req,res) => {
  const note = await Note.findById(req.params.id).populate('user')
  if(note){
    return res.status(200).json(note)
  } else{
    res.status(404).json({ message : 'Note not found' })
  }
})

notesRouter.delete('/:id', async(req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  res.status(204).end()
})


notesRouter.put('/:id', validateNote, async(req,res) => {
  const { content, important } = req.body

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    {content, important},
    {new: true}
  )
  if (!updatedNote){
    return res.status(404).json({error: "note not found"})
  }
  res.status(200).json(updatedNote)
})

notesRouter.post('/', validateNote, async(req,res) => {
  const { content, important , userId } = req.body

  const user = await User.findById(userId)
  if(!user){
    return res.status(400).json({ error: 'userid missing or invalid' })
  }
  const note =Note({
    content,
    important: important || false,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  res.status(201).json(savedNote)
})

module.exports = notesRouter