const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Order = require('../models/Order.model');

const router = express.Router()


// CREATE ORDER
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()

        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})


// UPDATE ORDER
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {   
                $set: req.body
            },
            {
                new: true
            }
        )

        console.log(updatedOrder)
        res.status(200).json(updatedOrder);

    } catch (err) {
        res.status(500).json(err)
    }
    
})



// DELETE ORDER
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
    }
})



// GET USER ORDERS
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.id })
        if (!orders) {
            return res.status(404).json({ message: 'Order not found' });
          }
      
        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json(err);
    }
})


// GET ALL ORDERS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err);
    }
})


// (STATS) GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {
                $match: { createdAt: { $gte: previousMonth } },
            },

            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                }
            },

            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            },
        ]);

        res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;