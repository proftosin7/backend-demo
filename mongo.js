const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://proftosin7:${password}@eosquare.gqiyw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=eosquare`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

// const note = new Note({
//   content: 'JavaScript has a single thread model',
//   important: true,
// })



// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })