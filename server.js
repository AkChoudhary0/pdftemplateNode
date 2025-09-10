// const userRoute = require("./routes/user/user")

// const express = require('express');
// const app = express();
// const db = require('./db')

// //routes
// app.use("/api-v1/user", userRoute)

// // Middleware to parse JSON and form data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Start the server
// const PORT = process.env.port;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });


require("dotenv").config()
const express = require('express');
const app = express();
const db = require('./db')
const userRoute = require("./routes/user/user")
const cors = require("cors")
const path = require("path")

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('./uploads/'))

app.use(cors());

app.use("/api-v1/users", userRoute);

// Start the server
const PORT = process.env.port;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

