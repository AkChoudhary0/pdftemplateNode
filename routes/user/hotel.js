const express = require('express');
const router = express.Router();
const hotelController = require("../../controllers/hotelController");
const upload = require("../../middlewares/uploads");

// Hotel CRUD
router.post("/create", upload.single("image"), hotelController.createHotel);
router.get("/get-hotels", hotelController.getHotels);
router.put("/update/:id", upload.single("image"), hotelController.updateHotel);
router.delete("/delete/:id", hotelController.deleteHotel);

module.exports = router;
