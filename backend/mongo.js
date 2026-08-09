const mongoose = require('mongoose')

if(process.argv.length <3){
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const mongo_url = `mongodb+srv://rymerkih:${password}@cluster0.1zqhghm.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
// const mongo_url = 'mongodb://127.0.0.1:27017/noteApp'

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