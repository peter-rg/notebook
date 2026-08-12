const Note = require('../models/notes')
const notesRouter = require('express').Router()
const { validateNote } = require('../utils/middleware')

notesRouter.get('/', (req, res) => {
  Note.find({}).then(notes => res.json(notes))
})

notesRouter.get('/:id', (req,res,next) => {
  Note.findById(req.params.id)
    .then(note => {
      if(note){
        res.status(200).json(note)
      }
      else{
        res.status(404).json(
          {
            message: 'Note not found'
          }
        )
      }
    })
    .catch(err => next(err))

})

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
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

notesRouter.post('/', validateNote, (req,res, next) => {
  const { content, important } = req.body

  const note =Note({
    content,
    important: important || false,
  })

  note.save()
    .then(savedNote => res.status(201).json(savedNote))
    .catch(err => next(err))
})

module.exports = notesRouter