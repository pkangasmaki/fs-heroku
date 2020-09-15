const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

var morgan = require('morgan')
const { response } = require('express')

app.use(express.json())
app.use(express.static('build'))

//Morgan custom config
app.use(morgan(function (tokens, req, res) {
    if (tokens.method(req,res) == "POST") {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
          ].join(' ')
    } 
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }))

//info page
app.get('/info', (req,res,next) => {
    Person.countDocuments({}).then(result => {
        res.send(
            `<p>Phonebook has info for ${result} people </p>
            <p>${new Date()}</p>`
            )
    })
    .catch(error => next(error))
})

//List of the people in phonebook
app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
    .catch(error => next(error))
})

//Single person from the phonebook with :id
app.get('/api/persons/:id', (req,res,next) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON())
    })
    .catch(error => next(error))
})

//Delete person with :id
app.delete('/api/persons/:id', (req,res,next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
    .catch(error => next(error))
})

//Add a new person
app.post('/api/persons', (req,res,next) => {
    const body = req.body

    //Nimi tai numero puuttuu
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    } 

    const newPerson = new Person ({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedPerson => {
        res.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

//Update a number
app.put('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndUpdate(req.params.id, {number: req.body.number})
        .then(updatedPerson => {
            res.send(updatedPerson)
        })
        .catch(error => next(error))
})

//Error handling middleware
const errorHandler = (err, req, res, next) =>{
    console.log(err.message)

    if(err.name === 'CastError') {
        return res.status(400).send({error: 'malformmated id'})
    }
    else if(err.name === 'ValidationError') {
        return res.status(422).send({error: err.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})