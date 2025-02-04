const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from public folder
app.use(express.static("public/html"));
app.use("/img", express.static(path.join(__dirname, "public/img")));

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
app.use(express.static("public/html"));
app.get("/api/products", async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
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

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

// Serve other HTML files
app.get("/:page", (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, "public/html", page);
  
  // If no extension is provided, assume .html
  const fullPath = filePath.endsWith(".html") ? filePath : `${filePath}.html`;
  
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).sendFile(path.join(__dirname, "public/html/404.html"));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
