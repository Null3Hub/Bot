const cache = new Map();
const EXPIRY_TIME = 10 * 60 * 1000; // 10 minutos

module.exports = {
  get(userId) {
    const item = cache.get(userId);
    if (!item) return null;
    if (Date.now() > item.expires) {
      cache.delete(userId);
      return null;
    }
    return item.data;
  },

  set(userId, data) {
    cache.set(userId, {
      data,
      expires: Date.now() + EXPIRY_TIME
    });
  },

  delete(userId) {
    cache.delete(userId);
  }
};