const express = require('express');
const bcrypt = require('bcrypt');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const User = require('../models/User.model');

const router = express.Router()


// UPDATE USER
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



// DELETE USER
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
          }
      
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
    }
})



// GET A USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
        const { password, ...others} = user._doc;
        res.status(200).json(others);

    } catch (err) {
        res.status(500).json(err);
    }
})


// GET ALL USERS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find();
        if (!users) {
            return res.status(404).json({ message: 'Not found' });
          }
      
        res.status(200).json(users);

    } catch (err) {
        res.status(500).json(err);
    }
})


// GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1))

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear} } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]) 

        res.status(200).json(data)

    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router;