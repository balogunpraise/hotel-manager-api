const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  quantity: { type: Number, default: 1 },
  requestDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['requested', 'in-progress', 'completed', 'cancelled'], 
    default: 'requested' 
  },
  notes: { type: String },
  totalAmount: { type: Number }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);

