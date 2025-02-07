const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())



const Note = require('./models/note')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const url = process.env.MONGODB_URI;


// mongoose.set('strictQuery',false)

// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })



// const Note = mongoose.model('Note', noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// }))



let notes = [
//     {"id":"1","content":"HTML is easy","important":true},
//     {"id":"2","content":"Browser can execute only JavaScript","important":false},
//     {"id":"3","content":"GET and POST are the most important methods of HTTP protocol","important":true}
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {


  Note.find({}).then(notes => {
    response.json(notes)}
  )}   )



app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  console.log(request.params)

  Note.findById(id).then(note => {

    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response, next) => {
  const body = request.body
  console.log(request.body)

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    id: generateId(),
    content: body.content,
    important: body.important || false
  })
  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
  // notes = notes.concat(note)
  // response.json(note)
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const { content, important } = request.body

  Note.findByIdAndUpdate(id, { content, important }, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      if (updatedNote) {
        response.json(updatedNote)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// notes.find(note => note.id === id)
// if (note) {
//     note.important = body.important
//     response.json(note)
// } else {
//     response.status(404).end()
// }






app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })

  // notes = notes.filter(note => note.id !== id)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




