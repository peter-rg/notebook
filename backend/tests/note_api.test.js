const { test, after, beforeEach, describe } = require('node:test')
const app = require('../app')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const assert = require('node:assert')
const Note = require('../models/notes')
const User = require('../models/users')
const { initialNotes, notesInDb, nonExistingId } = require('./test_helper')

const api = supertest(app)

describe('when there is some notes saved initially', () => {
  beforeEach(async() => {
    await Note.deleteMany({})
    await User.deleteMany({})

    const password = await bcrypt.hash('124rdj', 10)
    const user = new User({
      name: 'rymer kim',
      username: 'ryme7',
      password
    })
    const savedUser = await user.save()

    const noteObjects = initialNotes.map(
      note => new Note({
        content: note.content,
        important: note.important,
        user: savedUser._id
      })
    )
    const savedNoteIds =[]
    for(let note of noteObjects){
      const savedNote = await note.save()
      savedNoteIds.push(savedNote._id)
    }
    savedUser.notes = savedNoteIds
    await savedUser.save()
  })

  test('notes are returned as json', async() => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type' , /application\/json/)
  })

  test('all notes are returned', async() => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, initialNotes.length)
  })

  test('a specific note is within the returned notes', async() => {
    const notes = await api.get('/api/notes')
    const contents = notes.body.map(note => note.content)
    assert(contents.includes(initialNotes[1].content))
  })

  describe('viewing of a specific note', () => {
    test('succeeds with a valid id', async() => {
      const notes = await notesInDb()
      const noteToView = await Note.findById(notes[0].id).populate('user')

      const resultNote = await api.get(`/api/notes/${notes[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      // match noteToView with the API response
      const processedNote = JSON.parse(JSON.stringify(noteToView))
      assert.deepStrictEqual(resultNote.body, processedNote)
    })

    test('fails with statuscode 404 if note does not exist', async() => {
      const validId = await nonExistingId()

      await api.get(`/api/notes/${validId}`).expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async() => {
      const invalidId = '3782wijs'
      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async() => {
      const user = await User.find({})
      // console.log("user", user)
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: user[0]._id
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

    test('fails with statusCode 400 if data is invalid', async() => {
      const newNote = { important: true }
      await api.post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await notesInDb()
      assert.strictEqual(notesAtEnd.length, initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with statuscode 204 if id is valid', async() => {
      const notesAtStart = await notesInDb()
      const noteToDelete = notesAtStart[0]

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)
      const notesAtEnd = await notesInDb()

      const ids = notesAtEnd.map(n => n.id)
      assert(!ids.includes(noteToDelete.id))
      assert.strictEqual(notesAtEnd.length, notesAtStart.length -1)
    })

  })
})
after(async () => {
  await mongoose.connection.close()
})