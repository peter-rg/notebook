const Note = require('../models/notes')
const notesRouter = require('express').Router()
const { validateNote } = require('../utils/middleware')

notesRouter.get('/', async(req, res) => {
  const notes = await Note.find({})
  res.status(200).json(notes)
})

notesRouter.get('/:id', async(req,res) => {
  const note = await Note.findById(req.params.id)
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


notesRouter.put('/:id', validateNote, (req,res, next) => {
  const { content, important } = req.body

  Note.findById(req.params.id)
    .then(note => {
      if(!note){
        return res.status(404).send({ error: 'note not found' })
      }
      note.content = content
      if(important !== undefined){
        note.important = important
      }

      return note.save()
        .then(updatedNote => res.status(200).json(updatedNote))
    })
    .catch(err => next(err))
})

notesRouter.post('/', validateNote, async(req,res) => {
  const { content, important } = req.body

  const note =Note({
    content,
    important: important || false,
  })

  const savedNote = await note.save()
  res.status(201).json(savedNote)
})

module.exports = notesRouter