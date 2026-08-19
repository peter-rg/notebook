const {describe, test, beforeEach, after}= require('node:test')
const assert = require('node:assert')
const User = require('../models/users')
const helper = require('./test_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user in db', () =>{
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = 'secret'.split().reverse().join().concat('iuwy8')
    const user = new User({username: "paul", passwordHash})
    await user.save()
  })

  test('creation succedes with fresh userName', async() => {
    const userAtStart = await helper.usersInDb()
    const newUser = {
      name: "rymer kim",
      username: 'ryme7',
      password: "12345"
    }
    const result = await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, userAtStart.length + 1)
    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with statuscode 400 when username exists', async() => {
    const userAtStart = await helper.usersInDb()
    const newUser= {
      name: "paul kim",
      username: "paul",
      password: "hen"
    }
    const result = await api.post('/api/users').send(newUser).expect(400)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, userAtStart.length)
    assert(result.body.error.includes('expected `username` to be unique'))
  })
})

after(async() => await mongoose.connection.close())