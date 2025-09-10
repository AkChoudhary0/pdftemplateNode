require('dotenv').config()
const mongoose = require('mongoose')
console.log("env data++++++++++",process.env.db_url + process.env.db_name)

// const dbUrl = "mongodb+srv://aktechno:lq4WvfUBOl6sir8C@aktech1.apbn0iy.mongodb.net/?retryWrites=true&w=majority/tajflight"
const dbUrl = process.env.db_url + process.env.db_name

const connection = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose
    .connect(dbUrl, connection)
    .then((res) => {
        console.info('Connected to db')
    })
    .catch((e) => {
        console.log('Unable to connect to the db', e)
    })