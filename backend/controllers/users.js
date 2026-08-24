const User = require('../models/users')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

usersRouter.get('/', async(req,res) => {
  const users = await User.find({}).populate(
    'notes', { content:1, important:1 }
  )
  res.status(200).json(users)
})

usersRouter.get('/:id', async(req,res) => {
  const user = await User.findById(req.params.id).populate('notes', { user: 0 })
  res.status(200).json(user)
})

usersRouter.post('/', async(req, res) => {
  const { name, username, password } = req.body
  if (!password || password.length < 3) {
    return res.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }
  const passwordHash = await bcrypt.hash(password.toString(), 12)

  const newUser = new User({ name,username, passwordHash })
  const createdUser = await newUser.save()
  if(createdUser){
    return res.status(201).json(createdUser)
  }
})

module.exports = usersRouter