const { test, after, beforeEach } = require('node:test')
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const api = supertest(app)
const Note = require('../models/notes')
const { initialNotes, notesInDb } = require('./test_helper')



beforeEach(async() => {
  await Note.deleteMany({})
  await Note.insertMany(initialNotes)
})

test('notes are returned as json', async() => {
  console.log('entered tests...')
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type' , /application\/json/)
})

test('all notes are returned', async() => {
  const notesAtEnd = await notesInDb()
  // console.log("total", response.body.length)
  assert.strictEqual(notesAtEnd.length, initialNotes.length)
})

test('a specific note is within the returned notes', async() => {
  const notes = await notesInDb()
  const contents = notes.map(note => note.content)
  // console.log(JSON.stringify(content))
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added', async() => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true
  }
  await api.post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length + 1)
  const contents = notesAtEnd.map(r => r.content)
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content will not be added', async() => {
  const newNote = { important: true }
  await api.post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length)
})
test('a specific note can be viewed', async() => {
  const notesAtStart = await notesInDb()
  const noteToView = notesAtStart[0]

  const resultNote = await api.get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async() => {
  const notesAtStart = await notesInDb()
  const noteToDelete = notesAtStart[0]
  await api.delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await notesInDb()
  const ids = notesAtEnd.map(note => note.id)

  assert(!ids.includes(noteToDelete.id))
  assert.strictEqual(notesAtEnd.length, initialNotes.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})