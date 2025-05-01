const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded', 'cancelled'], 
    default: 'pending' 
  },
  bookingStatus: { 
    type: String, 
    enum: ['confirmed', 'checked-in', 'checked-out', 'no-show', 'cancelled'], 
    default: 'confirmed' 
  },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
