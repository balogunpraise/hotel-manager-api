const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RoomType', 
    required: true 
  },
  floor: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance', 'reserved'], 
    default: 'available' 
  },
  amenities: [{ type: String }],
  lastCleaned: { type: Date },
  nextCleaningSchedule: { type: Date }
});

module.exports = mongoose.model('Room', roomSchema);