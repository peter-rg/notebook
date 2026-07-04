const express = require('express')
const cors = require('cors')

let notes = [  
  {    id: "1",    content: "HTML is easy",    important: true  },  
  {    id: "2",    content: "Browser can execute only JavaScript",    important: false  },  
  {    id: "3",    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }
]

const app = express()
app.use(cors())
app.get("/", (req, res)=>{
  res.send("<h1>Hello from express!</h1>")
})
app.get("/api/notes/", (req, res)=>{
  res.json(notes)
})

app.get("/api/notes/:id", (req,res)=>{
  const id = req.params.id
  const note = notes.find(note => note.id === id)
  if(note){
    res.json(note)
  }
  else{
    res.status(404).end()
  }
  
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})


app.use(express.json())

app.post('/api/notes', (req,res)=>{
  const body = req.body
  
  if(!body?.content){
    return res.status(400).json({
      error: "content missing"
      })
    }
  const note ={
    content: body?.content,
    important: body.important || false,
    id: String(notes.length +1)
    }

  notes = notes.concat(note)

  console.log("note:", note)
  res.json(notes)
})

const unknownEndpoint = (req,res)=>{
  res.status(404).send({
    error :"unknown endpoint"
  })
}

app.use(unknownEndpoint)

const PORT =3000
app.listen(PORT, ()=>{
  console.log("Server running on port", PORT)
})
