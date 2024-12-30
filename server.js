const os = require("os");
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

const port = 3000;

const absoluteFilePath = path.join(__dirname, "../test");

const getFilePath = (fileName) => path.join(absoluteFilePath, fileName);

const getLocalIP = () => {
  const nets = os.networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  console.log("Your local IP is", results);
};

getLocalIP();

// Use express-fileupload middleware
app.use(fileUpload());

// Serve static files (like the HTML form)
app.use(express.static("public"));

// Handle file upload
app.post("/upload", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No file was uploaded.");
  }

  // Get the uploaded file
  const uploadedFile = req.files.file;

  // Define the upload path and move the file
  const uploadPath = getFilePath(uploadedFile.name);
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send("File uploaded successfully: " + uploadPath);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
