const mongoose = require('mongoose');

const ScriptSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  id:        { type: String, required: true, unique: true, index: true },
  placeId:   { type: String, required: true, index: true },
  
  // GitHub (Link externo, não o código)
  rawUrl:    { type: String, required: true }, 
  fileName:  { type: String, required: true },
  
  image:     { type: String, default: null },
  features:  { type: [String], default: [] },
  status:    { type: String, enum: ['active', 'maintenance', 'discontinued'], default: 'active' },
  version:   { type: Number, default: 1 }, // Contador interno
  
  logs: [{
    type:        String,
    description: String,
    from:        String,
    to:          String,
    date:        { type: Date, default: Date.now },
    by:          String,
    version:     Number,
  }],
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'scripts',
  versionKey: false,
});

module.exports = mongoose.model('Script', ScriptSchema);
