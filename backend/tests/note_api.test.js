const {test, after, beforeEach} = require('node:test')
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const api = supertest(app)
const Note = require('../models/notes')

const initialNotes = [  {    content: 'HTML is easy',    important: false,  },  {    content: 'Browser can execute only JavaScript',    important: true,  },]

test('notes are returned as json', async() => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type' , /application\/json/)
})

beforeEach(async() => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

after(async () => {
  await mongoose.connection.close()
})

test('all notes are returned', async() => {
  const response = await api.get('/api/notes')
  // console.log("total", response.body.length)
  assert.strictEqual(response.body.length, initialNotes.length)
})

test('a specific note is within the returned notes', async() => {
  const res = await api.get('/api/notes')
  const content = res.body.map(e => e.content)
  // console.log(JSON.stringify(content))
  assert(content.includes('HTML is easy'))
})