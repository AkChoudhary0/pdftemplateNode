require("dotenv").config()
const express = require('express');
const app = express();
const db = require('./db')
const userRoute = require("./routes/user/user")
const hotelRoute = require("./routes/user/hotel")
const cors = require("cors")
const path = require("path")


// app.get("/download/:file", (req, res) => {
//   const fileName = req.params.file;
//   const filePath = path.join(__dirname, "uploads", fileName);
//   res.download(filePath); // 👈 forces download
// });

// File download route (PDF or Images)
app.get("/download/:file/:name", (req, res) => {
  const fileName = req.params.file; 
  const originalName = req.params.name + "-" + fileName; 
  const filePath = path.join(__dirname, "uploads", fileName);

  res.download(filePath, originalName, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static folders (for images / uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "controllers/user/images")));

// Routes
app.use("/api-v1/users", userRoute);
app.use("/api-v1/hotels", hotelRoute); 

// Start the server
const PORT = process.env.port ; 
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});