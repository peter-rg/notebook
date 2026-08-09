const express = require('express')
const path = require('path')
const Note = require('./models/notes')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('<h1>Hello from express!</h1>')
})

app.get('/api/notes/', (req, res) => {
  Note.find({}).then(notes => res.json(notes))
})

app.get('/api/notes/:id', (req,res,next) => {
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

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

// notes validation
const validateNote=(req, res, next) => {
  const { content } = req.body
  if(!content){
    return res.status(400).json({ error: 'kindly provide content property' })
  }
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' })
  }
  if(content.trim().length <5){
    return res.status(400).json({ error: 'content cannot be less than 5 characters' })
  }

  next()
}

app.put('/api/notes/:id', validateNote, (req,res, next) => {
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

app.post('/api/notes', validateNote, (req,res, next) => {
  const { content, important } = req.body

  const note =Note({
    content,
    important: important || false,
  })

  note.save()
    .then(savedNote => res.status(200).json(savedNote))
    .catch(err => next(err))
})

const unknownEndpoint = (req,res) => {
  res.status(404).send({
    error :'unknown endpoint'
  })
}

app.use(unknownEndpoint)

app.get('/{*splat}', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const errorHandler= (error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'Malformatted id' })
  }
  if(error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  // console.log("Server running on port", PORT)
})
