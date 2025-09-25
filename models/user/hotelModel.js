const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Hotel address is required'],
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Hotel', HotelSchema);
