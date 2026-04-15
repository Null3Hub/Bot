const Product = require('../../models/store/Product');
const Transaction = require('../../models/store/Transaction');
const Inventory = require('../../models/store/Inventory');
const crypto = require('crypto');

class KeyService {
  /**
   * Atomically purchases a key. Prevents race conditions via MongoDB transactions.
   */
  static async purchase(productId, userId) {
    const session = await Product.startSession();
    session.startTransaction();
    try {
      const product = await Product.findOne({ productId, isActive: true, stock: { $gt: 0 } }).session(session);
      if (!product) {
        await session.abortTransaction();
        return { success: false, error: product ? 'Product out of stock.' : 'Product not found or inactive.' };
      }

      const keyToDeliver = product.keys[0];

      // Atomic update: remove 1 key, decrease stock
      const updateResult = await Product.updateOne(
        { productId, keys: keyToDeliver },
        { $pop: { keys: -1 }, $inc: { stock: -1 }, $set: { updatedAt: new Date() } }
      ).session(session);

      if (updateResult.modifiedCount === 0) {
        await session.abortTransaction();
        return { success: false, error: 'Concurrent purchase failed. Please try again.' };
      }

      // Save transaction & inventory
      const txId = `TX-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      const transaction = new Transaction({
        transactionId: txId, userId, productId, productName: product.name,
        keyDelivered: keyToDeliver, price: product.price, currency: product.currency
      });
      await transaction.save({ session });

      const inventory = new Inventory({ userId, productId, productName: product.name, key: keyToDeliver });
      await inventory.save({ session });

      await session.commitTransaction();
      return { success: true, key: keyToDeliver, txId, productName: product.name, price: product.price, currency: product.currency, remainingStock: product.stock - 1 };
    } catch (error) {
      await session.abortTransaction();
      console.error('[KeyService] Purchase transaction failed:', error);
      return { success: false, error: 'Internal server error during purchase.' };
    } finally {
      session.endSession();
    }
  }

  /**
   * Bulk adds keys to a product.
   */
  static async addStock(productId, keysArray) {
    const validKeys = keysArray.map(k => k.trim()).filter(k => k.length > 0);
    if (validKeys.length === 0) return { success: false, error: 'No valid keys provided.' };

    const product = await Product.findOne({ productId });
    if (!product) return { success: false, error: 'Product not found.' };

    product.keys.push(...validKeys);
    product.stock += validKeys.length;
    product.updatedAt = new Date();
    await product.save();
    return { success: true, added: validKeys.length, newStock: product.stock };
  }
}

module.exports = KeyService;
