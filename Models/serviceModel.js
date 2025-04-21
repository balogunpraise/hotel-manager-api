const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String }, // e.g., "Spa", "Restaurant", "Laundry"
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Service', serviceSchema);
