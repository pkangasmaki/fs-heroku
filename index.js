const express = require('express')
const app = express()

var morgan = require('morgan')

app.use(express.json())
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

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/', (req,res) => {
    res.send(
        `<h1>Sivut:</h1>
        <p>/info</p>
        <p>/api/persons</p>
        <p>/api/persons/:id</p>`
    )
})

app.get('/info', (req,res) => {
    const personAmount = persons.length
    res.send(
        `<p>Phonebook has info for ${personAmount} people </p>
        <p>${new Date()}</p>`
        )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id != id)

    res.status(204).end()
})

//Creates random Integer
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

//Checks if the parameter is already in persons
const checkDuplicates = (newPerson) => {
    let isDuplicate = false

    let found = persons.find(person => person.name === newPerson)

    if(found) {
        isDuplicate = true
        console.log("Duplicate found")
    }
    return isDuplicate
}

app.post('/api/persons', (req,res) => {
    const body = req.body

    const newPerson = {
        name: body.name,
        number: body.number,
        id: getRandomInt(10000)
    }

    //Nimi tai numero puuttuu
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    } 
    else if (checkDuplicates(body.name)) {
        return res.status(409).json({
            error: 'person is already in the phonebook'
        })
    } 

    persons = persons.concat(newPerson)
    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})