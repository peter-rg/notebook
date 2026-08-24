const { describe, test, beforeEach, after }= require('node:test')
const assert = require('node:assert')
const User = require('../models/users')
const helper = require('./test_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'paul', passwordHash })
    await user.save()
  })
  describe('Creation of user', () => {
    test('succedes with fresh userName', async() => {
      const userAtStart = await helper.usersInDb()
      const password = await bcrypt.hash('12345', 10)
      const newUser = {
        name: 'rymer kim',
        username: 'ryme7',
        password
      }
      await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, userAtStart.length + 1)
      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(newUser.username))
    })

    test('fails with statuscode 400 when username exists', async() => {
      const userAtStart = await helper.usersInDb()
      const password = await bcrypt.hash('hen', 5)
      const newUser= {
        name: 'paul kim',
        username: 'paul',
        password
      }
      const result = await api.post('/api/users').send(newUser).expect(400)
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, userAtStart.length)
      assert(result.body.error.includes('expected `username` to be unique'))
    })
    test('fails with statuscode 400 if password is small/missing', async() => {
      const userWithSmallPassword = {
        name: 'Gregory loka',
        username: 'Grego',
        password: '27'
      }
      const userWithoutPassword = {
        name: 'jme soay',
        username: 'jacj'
      }
      const response = await api.post('/api/users').send(userWithSmallPassword).expect(400)
      await api.post('/api/users').send(userWithoutPassword).expect(400)
      assert(response.body.error.includes('password must be at least 3 characters long'))
    })
  })

})

after(async() => await mongoose.connection.close())