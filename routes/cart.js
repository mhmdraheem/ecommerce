const express = require("express");
const router = express.Router();

router.get("/count", (req, res) => {
  res.json(req.session.cart.length);
});

// Get cart items
router.get("/", (req, res) => {
  res.json(req.session.cart);
});

router.get("/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  const item = req.session.cart.find((item) => item.id === itemId);
  res.json(item ? item : null);
});

// Add item to cart
router.post("/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  const { primaryImage, title, price } = req.body;
  const item = {
    id: itemId,
    quantity: 1,
    image: primaryImage,
    title: title,
    price: price,
  };
  req.session.cart.push(item);
  res.json(item);
});

// Remove item from cart
router.delete("/:itemId", (req, res, next) => {
  const itemId = req.params.itemId;
  req.session.cart = req.session.cart.filter((item) => item.id !== itemId);
  res.status(200).json({});
});

// Update item quantity
router.put("/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  const { quantity } = req.body;
  const item = req.session.cart.find((item) => item.id === itemId);
  if (item) {
    item.quantity = parseInt(quantity) || 1;
  }

  res.json(item);
});

module.exports = router;
