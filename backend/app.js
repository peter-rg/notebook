const express = require('express')
const path = require('path')
const middlware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const notesRouter = require('./controllers/notes')
const { MONGODB_URI } = require('./utils/config')
const app = express()

const url = MONGODB_URI
logger.info('connecting to', url)

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(err => logger.error('error connecting to MongoDB', err.message))

app.use(express.json())
app.use(express.static('dist'))
app.use(middlware.requestLogger)
app.use('/api/notes/', notesRouter)

app.get('/{*splat}', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(middlware.unknownEndpoint)
app.use(middlware.errorHandler)

module.exports = app
