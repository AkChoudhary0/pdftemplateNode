import express from "express";
import upload from "../middlewares/upload.js";
import {
    getLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
} from "../controllers/locationController.js";

const router = express.Router();

// CRUD routes
router.get("/", getLocations);
router.get("/:id", getLocationById);

router.post("/", upload.array("images", 3), addLocation);
router.put("/:id", upload.array("images", 3), updateLocation);
router.delete("/:id", deleteLocation);

export default router;
