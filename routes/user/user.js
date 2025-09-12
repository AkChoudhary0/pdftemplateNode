const express = require('express');
const router = express.Router();
const userController = require("../../controllers/user/userController");

// User Auth
router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);

// PDF Operations
router.post("/convert-pdf", userController.convertPdf);
router.get("/get-pdfs", userController.getPdfs);

module.exports = router;
    