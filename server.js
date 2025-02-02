const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public/html"));

// Cache for products data
let productsCache = null;

// Helper to load products from file
function loadProducts() {
  if (!productsCache) {
    const filePath = path.join(__dirname, "products.json");
    productsCache = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return productsCache;
}

// Products API endpoint
app.get("/products", (req, res) => {
  try {
    console.log("Fetching products", req.query);

    const numOfProducts = parseInt(req.query.numOfProducts) || 5;
    const sortBy = req.query.sortBy || "rating";

    const products = loadProducts();

    // Sort products based on sortBy parameter
    const sortedProducts = sortProducts([...products], sortBy);

    // Return requested number of products
    let response = sortedProducts.slice(0, numOfProducts);
    res.json(response);
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
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "price":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
  }

  return sortedProducts;
}

function readFile(file) {
  const filePath = path.join(__dirname, "json/no_website/", file);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Serve static images from img folder
app.get("/img/:type?/:imageName", (req, res) => {
  try {
    const imageName = req.params.imageName;
    const type = req.params.type;

    const imagePath =
      type === "product"
        ? path.join(__dirname, "public/img/product", imageName)
        : path.join(__dirname, "public/img", imageName);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Send the image file
    res.sendFile(imagePath);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
