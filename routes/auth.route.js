const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/User.model')


// REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Generate a salt with a specified number of rounds
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)

        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, salt)

        // create a new user document
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        })

        // save the user in the database
        const savedUser = await newUser.save()
        console.log(savedUser)
        res.status(201).json(savedUser)

    } catch(err) {
        res.status(501).json(err)
    }
    
})



// LOGIN
router.post('/login', async (req, res) => {

    try {
        // Find user based on provided email
        const user = await User.findOne({ email: req.body.email});
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Compare the entered password with the stored hash
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Wrong Credentials!"})
        }

        // Password  matched, authentication successful
        const { password, ...others } = user._doc;
        res.status(200).json(others)


    } catch (err) {
        res.send(401).json({error: 'An error occurred'})
    }
})


module.exports = router;