const  {Schema, model} = require('mongoose')

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = model('User', userSchema)
module.exports = User