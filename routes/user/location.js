const express = require("express");
const upload = require("../../middlewares/uploads");

const {
    getLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
} = require("../../controllers/locationController");

const router = express.Router();



// CRUD routes
router.get("/", getLocations);
router.get("/:id", getLocationById);

router.post(
    "/",
    upload.fields([
        { name: "img", maxCount: 1 },
        { name: "img1", maxCount: 1 },
        { name: "img2", maxCount: 1 }
    ]),
    addLocation
);
router.put("/:id", upload.fields([
    { name: "img", maxCount: 1 },
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 }
]), updateLocation);
router.delete("/:id", deleteLocation);

module.exports = router;
