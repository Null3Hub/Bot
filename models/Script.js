const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  type:        { type: String },
  description: { type: String },
  by:          { type: String },
  version:     { type: Number },
  date:        { type: Date, default: Date.now }
});

const ScriptSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  id:       { type: String, required: true, unique: true },
  placeId:  { type: String, required: true },
  rawUrl:   { type: String },
  fileName: { type: String },
  image:    { type: String, default: null },
  features: [{ type: String }],
  status:   { type: String, enum: ['active', 'maintenance', 'discontinued'], default: 'active' },
  version:  { type: Number, default: 1 },
  logs:     [LogSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Script', ScriptSchema);
