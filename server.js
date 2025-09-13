


require("dotenv").config()
const express = require('express');
const app = express();
const db = require('./db')
const userRoute = require("./routes/user/user")
const cors = require("cors")
const path = require("path")


app.get("/download/:file", (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(__dirname, "uploads", fileName);
  res.download(filePath); // 👈 forces download
});

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('./uploads/'));
app.use("/images", express.static(path.join(__dirname, "controllers/user/images")));

app.use(cors());

app.use("/api-v1/users", userRoute);

// Start the server
const PORT = process.env.port;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

