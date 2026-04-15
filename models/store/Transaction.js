const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  productName: { type: String, required: true },
  keyDelivered: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['completed', 'pending', 'cancelled', 'refunded'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'store_transactions', versionKey: false });

TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('StoreTransaction', TransactionSchema);
