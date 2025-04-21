const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Deluxe", "Suite"
  description: { type: String },
  capacity: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  amenities: [{ type: String }],
  size: { type: String }, // e.g., "30 sqm"
  bedType: { type: String } // e.g., "King", "Queen", "Twin"
});

module.exports = mongoose.model('RoomType', roomTypeSchema);

