const Location = require("../models/user/Location");
const path = require("path");
const fs = require("fs");


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
            filesObj.img1?.[0],
            filesObj.img2?.[0]
        ].map(file => file ? `https://api.pdf.tajgateways.com/uploads/images/${path.basename(file.path)}` : null);

        const newLocation = new Location({
            ...req.body,
            img: filePaths[0],
            img1: filePaths[1],
            img2: filePaths[2],
        });
        console.log("New Location Data:", newLocation);
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
            filesObj.img1?.[0],
            filesObj.img2?.[0]
        ].map(file => file ? `https://api.pdf.tajgateways.com/uploads/images/${path.basename(file.path)}` : null);

        const updatedData = {
            ...req.body,
            ...(filePaths[0] && { img: filePaths[0] }),
            ...(filePaths[1] && { img1: filePaths[1] }),
            ...(filePaths[2] && { img2: filePaths[2] }),
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
        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        // 🧹 Delete images from local uploads folder
        const images = [location.img, location.img1, location.img2].filter(Boolean);

        images.forEach((imgUrl) => {
            try {
                // Extract file name from the full URL
                const fileName = path.basename(imgUrl);
                const filePath = path.join(__dirname, "../uploads/images", fileName);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // delete the image file
                }
            } catch (err) {
                console.error("Error deleting image:", err);
            }
        });

        // 🗑️ Delete location document from DB
        await Location.findByIdAndDelete(id);

        res.status(200).json({ message: "Location and images deleted successfully" });
    } catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).json({ message: "Error deleting location", error: error.message });
    }
};

module.exports = {
    getLocations,
    getLocationById,
    addLocation,
    updateLocation,
    deleteLocation
};
