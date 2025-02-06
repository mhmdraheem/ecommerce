const express = require("express");
const router = express.Router();

// Get cart items
router.get("/", (req, res) => {
  res.json(req.session.cart);
});

// Add item to cart
router.post("/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  const existingItem = req.session.cart.find((item) => item.id === itemId);
  const { primaryImage, title, price } = req.body;

  if (existingItem) {
    existingItem.quantity++;
  } else {
    req.session.cart.push({
      id: itemId,
      quantity: 1,
      image: primaryImage,
      title: title,
      price: price,
    });
  }
  res.json(req.session.cart);
});

// Remove item from cart
router.delete("/:itemId", (req, res, next) => {
  const itemId = req.params.itemId;
  req.session.cart = req.session.cart.filter((item) => item.id !== itemId);
  res.json(req.session.cart);
});

// Update item quantity
router.put("/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  const { quantity } = req.body;

  const item = req.session.cart.find((item) => item.id === itemId);
  if (item) {
    item.quantity = parseInt(quantity) || 1;
  }

  res.json(req.session.cart);
});

module.exports = router;
