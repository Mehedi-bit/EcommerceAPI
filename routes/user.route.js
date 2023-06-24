const express = require('express');
const bcrypt = require('bcrypt');
const { verifyTokenAndAuthorization } = require('./verifyToken');
const User = require('../models/User.model');

const router = express.Router()

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    // We are updating the user
    // User can update the password also, so encrypt it again
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }

    // Update the user in the database
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        res.status(200).json(updatedUser);

    } catch (err) {
        res.status(500).json(err)
    }
    

})



module.exports = router;