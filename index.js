const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const userRouter = require('./routes/user.route')

const app  = express()


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Success!! Database connected"))
    .catch((err) => console.log('Something went wrong', err))


app.use(express.json())
app.use('/api/user', userRouter)


app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend Server Running on port ${process.env.PORT}`)
})