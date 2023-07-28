const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const userRoute = require('./routes/user.route')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product.route')
const cartRoute = require('./routes/cart.route')
const orderRoute = require('./routes/order.route')

const app  = express()


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Success!! Database connected"))
    .catch((err) => console.log('Something went wrong', err))


app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend Server Running on port ${process.env.PORT}`)
})