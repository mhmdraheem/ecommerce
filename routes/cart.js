const express = require('express');
const router = express.Router();

const carts = new Map(); // Store carts by session ID

function getCart(sessionId) {
  if (!carts.has(sessionId)) {
    carts.set(sessionId, []);
  }
  return carts.get(sessionId);
}

async function addCartItem(item) {
    console.log("Call started");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    console.log("Call ended");
  const existingItem = cart.find((cartItem) => cartItem.id === item);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: item,
      quantity: 1,
    });
  }
  showHeaderCartAlert();
}

async function removeCartItem() {
    console.log("Call started");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Call ended");
}

async function updateCartItem() {
    console.log("Call started");
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Call ended");
}

module.exports = router;