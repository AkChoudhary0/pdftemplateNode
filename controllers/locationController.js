import Location from "../models/Location.js";
import path from "path";

// 📍 Get all locations
export const getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching locations", error });
    }
};

// 📍 Get single location by ID
export const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: "Error fetching location", error });
    }
};

// ➕ Add new location
export const addLocation = async (req, res) => {
    try {
        const files = req.files || [];
        const filePaths = files.map((file) => `/uploads/${path.basename(file.path)}`);

        const newLocation = new Location({
            ...req.body,
            img: filePaths[0] || null,
            img2: filePaths[1] || null,
            img3: filePaths[2] || null,
        });

        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ message: "Error adding location", error });
    }
};

// ✏️ Update existing location
export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files || [];
        const filePaths = files.map((file) => `/uploads/${path.basename(file.path)}`);

        const updatedData = {
            ...req.body,
            ...(filePaths[0] && { img: filePaths[0] }),
            ...(filePaths[1] && { img2: filePaths[1] }),
            ...(filePaths[2] && { img3: filePaths[2] }),
        };

        const updated = await Location.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updated) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating location", error });
    }
};

// ❌ Delete location
export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Location.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Location not found" });
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting location", error });
    }
};
