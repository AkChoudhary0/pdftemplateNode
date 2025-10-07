const Location = require("../models/user/Location");
const path = require("path");

// 📍 Get all locations
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching locations", error });
    }
};

// 📍 Get single location by ID
const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: "Error fetching location", error });
    }
};

// ➕ Add new location
const addLocation = async (req, res) => {
    try {
        const filesObj = req.files || {};
        const filePaths = [
            filesObj.img?.[0],
            filesObj.img2?.[0],
            filesObj.img3?.[0]
        ].map(file => file ? `http://localhost:3020/uploads/image/${path.basename(file.path)}` : null);

        const newLocation = new Location({
            ...req.body,
            img: filePaths[0],
            img2: filePaths[1],
            img3: filePaths[2],
        });

        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (err) {
        console.error("Error adding location:", err);
        res.status(500).json({ message: "Error adding location", error: err.message });
    }
};


// ✏️ Update existing location
const updateLocation = async (req, res) => {
    try {
        const filesObj = req.files || {};
        const filePaths = [
            filesObj.img?.[0],
            filesObj.img2?.[0],
            filesObj.img3?.[0]
        ].map(file => file ? `http://localhost:3020/uploads/image/${path.basename(file.path)}` : null);

        const updatedData = {
            ...req.body,
            ...(filePaths[0] && { img: filePaths[0] }),
            ...(filePaths[1] && { img2: filePaths[1] }),
            ...(filePaths[2] && { img3: filePaths[2] }),
        };

        const updated = await Location.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updated) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ message: "Error updating location", error: error.message });
    }
};


// ❌ Delete location
const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Location.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Location not found" });
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting location", error });
    }
};

module.exports = {
    getLocations,
    getLocationById,
    addLocation,
    updateLocation,
    deleteLocation
};
