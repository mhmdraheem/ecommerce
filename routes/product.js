const express = require('express');
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
    try {
      console.log(req.query);
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const sortBy = req.query.sortBy || "rating";
  
      const products = loadProducts();
  
      // Sort products based on sortBy parameter
      const sortedProducts = sortProducts([...products], sortBy);
  
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
    } catch (error) {
      console.error("Error serving products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
});
  
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
  
  function readFile(file) {
    const filePath = path.join(__dirname, "json/no_website/", file);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  
  module.exports = router;