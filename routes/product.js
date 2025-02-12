const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

let productsCache = null;
function loadProducts() {
  if (!productsCache) {
    const filePath = path.join(__dirname, "..", "data", "products.json");
    productsCache = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return productsCache;
}

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortBy = req.query.sortBy || "rating";

  let name = null;
  if (req.query.query && req.query.query !== "null") {
    name = req.query.query;
  }

  const products = loadProducts();
  let filteredProducts = products;
  if (name) {
    filteredProducts = products.filter(filterProducts(name));
  }
  const sortedProducts = sortProducts([...filteredProducts], sortBy);

  // Calculate pagination values
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Prepare pagination metadata
  const pagination = {};
  if (endIndex < sortedProducts.length) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  // Get paginated results
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  res.json({
    pagination,
    currentPage: page,
    totalPages: Math.ceil(sortedProducts.length / limit),
    totalProducts: sortedProducts.length,
    products: paginatedProducts,
  });
});

function filterProducts(query) {
  return (product) => product.heading.title.toLowerCase().includes(query.toLowerCase());
}

// Sort products based on sortBy parameter
function sortProducts(products, sortBy) {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "rating":
      sortedProducts.sort((a, b) => b.rating.stars - a.rating.stars);
      break;
    case "name":
      sortedProducts.sort((a, b) => a.heading.title.localeCompare(b.heading.title));
      break;
    case "price":
      sortedProducts.sort((a, b) => a.price.currentPrice - b.price.currentPrice);
      break;
  }

  return sortedProducts;
}

router.get("/:id", (req, res) => {
  const product = loadProducts().find((product) => product.id === parseInt(req.params.id));
  res.json(product);
});

router.get("/:id/recent-products", (req, res) => {
  const recentProducts = [
    { id: 11, title: "Dior Sauvage", image: "perfume-channel-1.jpg", price: 99.99 },
    { id: 12, title: "Gucci Bloom", image: "perfume-channel-1.jpg", price: 89.99 },
    { id: 13, title: "Chanel No.5", image: "perfume-channel-1.jpg", price: 109.99 },
    { id: 14, title: "Hermes Terre d'Hermes", image: "perfume-channel-1.jpg", price: 119.99 },
    { id: 15, title: "Dior Homme", image: "perfume-channel-1.jpg", price: 129.99 },
    { id: 16, title: "Dior Sauvage", image: "perfume-channel-1.jpg", price: 99.99 },
    { id: 17, title: "Gucci Bloom", image: "perfume-channel-1.jpg", price: 89.99 },
    { id: 18, title: "Chanel No.5", image: "perfume-channel-1.jpg", price: 109.99 },
    { id: 19, title: "Hermes Terre d'Hermes", image: "perfume-channel-1.jpg", price: 119.99 },
    { id: 20, title: "Dior Homme", image: "perfume-channel-1.jpg", price: 129.99 },
  ];
  res.json(recentProducts);
});

module.exports = router;
