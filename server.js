const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static("public"));

// Endpoint to get the list of JSON files
app.get("/hello", (req, res) => {
  const folderPath = path.join(__dirname, "json/no_website");
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read directory" });
    }

    res.json({ res: "Hello world" });
  });
});

function readFile(file) {
  const filePath = path.join(__dirname, "json/no_website/", file);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
