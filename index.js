const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app  = express()

dotenv.config()


mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kdclmsj.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Success!! Database connected")
    })

    .catch((err) => {
        console.log('Something went wrong', err)
    })



app.get('/', (req, res) => {
    res.send('Hello')
})


app.listen(5000, () => {
    console.log('listening on port 5000')
})