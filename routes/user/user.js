const express = require('express');
const router = express.Router();
const userController = require("../../controllers/user/userController");

// User Auth
router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);

// PDF Operations
router.post("/convert-pdf", userController.convertPdf);
router.get("/get-pdfs", userController.getPdfs);
router.post("/generateItinerary", userController.generateItinerary);
router.get("/getGeneratedPdf/:name", userController.getGeneratedPdf);
router.post("/addUser", userController.addUser);
router.get("/getUsers", userController.getUsers);
router.get("/getUserById/:userId", userController.getUserById);
router.delete("/deleteUser/:userId", userController.deleteUser);
router.put("/changePassword/:userId", userController.updatePassword);
router.get("/getGeneratedPdf/:name", userController.getGeneratedPdf);

module.exports = router;
    