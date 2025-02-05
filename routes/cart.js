const express = require('express');
const router = express.Router();

// Get cart items
router.get('/', (req, res) => {
    res.json(req.session.cart);
});

// Add item to cart
router.post('/:itemId', (req, res) => {
  console.log("Add item to cart");
    const itemId = req.params.itemId;
    const existingItem = req.session.cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        req.session.cart.push({
            id: itemId,
            quantity: 1
        });
    }
    console.log(req.session.cart);
    
    res.json(req.session.cart);
});

// Remove item from cart
router.delete('/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    req.session.cart = req.session.cart.filter(item => item.id !== itemId);
    res.json(req.session.cart);
});

// Update item quantity
router.put('/:itemId', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
    const itemId = req.params.itemId;
    console.log(req.body);
    
    const { quantity } = req.body;
    
    const item = req.session.cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = parseInt(quantity) || 1;
    }
    
    res.json(req.session.cart);
});

module.exports = router;