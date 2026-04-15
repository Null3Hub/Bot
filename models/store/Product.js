const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, index: true, lowercase: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'R$' },
  stock: { type: Number, required: true, default: 0 },
  keys: [{ type: String }],
  image: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lowStockThreshold: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'store_products', versionKey: false });

module.exports = mongoose.model('StoreProduct', ProductSchema);
