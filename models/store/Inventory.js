const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  productName: { type: String, required: true },
  key: { type: String, required: true },
  status: { type: String, default: 'active', enum: ['active', 'revoked'] },
  purchasedAt: { type: Date, default: Date.now }
}, { collection: 'store_inventory', versionKey: false });

InventorySchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('StoreInventory', InventorySchema);
