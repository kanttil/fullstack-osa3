const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] === undefined) {
    console.log('puhelinluettelo:')

    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    console.log('lisätään henkilö ', person.name, ' numero ', person.number, ' luetteloon')

    person
        .save()
        .then(response => {
            mongoose.connection.close()
        })
}
