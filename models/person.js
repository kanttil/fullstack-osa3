const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person