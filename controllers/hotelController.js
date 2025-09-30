// controllers/hotelController.js
const Hotel = require('../models/user/hotelModel');
const path = require('path');
const fs = require('fs');

const uploadsPath = path.join('uploads/hotelImage');

exports.createHotel = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address required' });
    }

    let imagePath = null;
    if (req.file) {
      // store relative path => /uploads/filename.jpg
      imagePath = `${uploadsPath}/${req.file.filename}`;
    }

    const hotel = await Hotel.create({ name, address, image: imagePath });
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const { name, address } = req.body;
    if (name) hotel.name = name;
    if (address) hotel.address = address;

    if (req.file) {
      // delete old image file if exists
      if (hotel.image) {
        const oldPath = path.join(process.cwd(), hotel.image.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      hotel.image = `/${uploadsPath}/${req.file.filename}`;
    }

    await hotel.save();
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // delete image file if exists
    if (hotel.image) {
      const imagePath = path.join(process.cwd(), hotel.image.replace(/^\//, ''));
      console.log("Deleting image:", imagePath);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Hotel.findByIdAndDelete(req.params.id); // ✅ replace remove()

    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
};

