const express = require('express');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Product = require('../models/Product.model');

const router = express.Router()


// CREATE PRODUCT
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()

        res.status(200).json(savedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})


// UPDATE PRODUCT
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        res.status(200).json(updatedProduct);

    } catch (err) {
        res.status(500).json(err)
    }
    

})



// DELETE PRODUCT
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
    }
})



// GET A PRODUCT
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
        res.status(200).json(product);

    } catch (err) {
        res.status(500).json(err);
    }
})


// GET ALL PRODUCTS
router.get('/', async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try {
        let products;

        // FIND NEW PRODUCTS AND ALSO FIND CATEGORY WISE PRODUCTS
        if (queryNew) {
            products = await Product.find().sort({createdAt: -1}).limit(10);
        } else if (queryCategory) {
            products = await Product.find({
                categories: { 
                    $in: [queryCategory],
                }
            })
        } else {
            products = await Product.find();
        }
      
        res.status(200).json(products);

    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;