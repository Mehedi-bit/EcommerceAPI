const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Cart = require('../models/Cart.model');

const router = express.Router()


// CREATE CART
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()

        res.status(200).json(savedCart)
    } catch (err) {
        res.status(500).json(err)
    }
})


// UPDATE CART
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {   
                $set: req.body
            },
            {
                new: true
            }
        )


        
        console.log(updatedCart)
        res.status(200).json(updatedCart);

    } catch (err) {
        res.status(500).json(err)
    }
    
})



// DELETE CART
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
    }
})



// GET USER CART
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.id })
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
      
        res.status(200).json(cart);

    } catch (err) {
        res.status(500).json(err);
    }
})


// GET ALL CARTS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;