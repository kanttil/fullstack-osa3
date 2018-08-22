const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('data', function getData(req) {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(formatPerson))
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(formatPerson(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>` + new Date())
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    } else if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    Person
        .find({ name: newPerson.name })
        .then(result => {
            if (result.length > 0) {
                response.status(400).send({ error: 'name must be unique' })
            } else {
                newPerson
                    .save()
                    .then(savedPerson => {
                        response.json(formatPerson(savedPerson))
                    })
            }
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(formatPerson(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})