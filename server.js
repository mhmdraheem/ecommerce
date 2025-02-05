const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 3000;

const cartRoutes = require('./routes/cart');
const productsRoutes = require('./routes/product');

app.use('/api/cart', cartRoutes);
app.use('/api/product', productsRoutes);

// Serve static files from public folder
app.use(express.static("public/html"));
app.use("/img", express.static(path.join(__dirname, "public/img")));

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
