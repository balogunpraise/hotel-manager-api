const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  issueType: { type: String, required: true }, // e.g., "Plumbing", "Electrical"
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['reported', 'in-progress', 'completed'], 
    default: 'reported' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  startDate: { type: Date },
  endDate: { type: Date },
  cost: { type: Number },
  notes: { type: String }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
