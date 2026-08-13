const mongoose = require('mongoose')
require('dotenv').config()

const mongo_url = process.env.TEST_MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongo_url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Caro is bothering me!',
  important: true,
})

note.save().then(() => {
  console.log('note saved')
  mongoose.connection.close()
})


//async practice
// const findNotes = async()=>{
//   try {
//     const notes = await Note.find({})
//     notes.forEach(note=> console.log(note));

//   } catch (error) {
//     console.log("An error ocuured", error);
//   }finally{
//     mongoose.connection.close()
//   }
// }
// findNotes()

Note.find({}).then(result => {
  result.forEach(note => {
    console.log('note', note)
  })
  mongoose.connection.close()
})