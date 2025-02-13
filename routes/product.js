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

  let filterBy = {};
  if (req.query.name) {
    filterBy.key = "name";
    filterBy.value = req.query.name;
  } else if (req.query.brand) {
    filterBy.key = "brand";
    filterBy.value = req.query.brand;
  }

  const products = loadProducts();
  let filteredProducts = products;
  if (filterBy.key) {
    filteredProducts = products.filter(filterProducts(filterBy));
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

function filterProducts(filterBy) {
  if (filterBy.key == "name") {
    ``;
    return (product) => product.heading.title.toLowerCase().includes(filterBy.value.toLowerCase());
  } else if (filterBy.key == "brand") {
    return (product) => product.heading.brand.toLowerCase().includes(filterBy.value.toLowerCase());
  }
}

// Sort products based on sortBy parameter
function sortProducts(products, sortBy) {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "Rating":
      sortedProducts.sort((a, b) => b.rating.stars - a.rating.stars);
      break;
    case "Price":
      sortedProducts.sort((a, b) => a.price.currentPrice - b.price.currentPrice);
      break;
  }

  return sortedProducts;
}

router.get("/:id", (req, res) => {
  const product = loadProducts().find((product) => product.id === parseInt(req.params.id));
  req.session.viewedProducts.push(req.params.id);
  res.json(product);
});

router.get("/:id/related-products", (req, res) => {
  const productCategory = loadProducts().find((product) => product.id === parseInt(req.params.id)).heading.category;
  const relatedProducts = loadProducts()
    .filter((product) => product.heading.category === productCategory)
    .filter((p) => p.id != parseInt(req.params.id));
  res.json(relatedProducts);
});

module.exports = router;
