const cache = new Map();
const TTL = 15 * 60 * 1000; // 15 minutos

module.exports = {
  set(userId, data) {
    cache.set(userId, { data, expires: Date.now() + TTL });
  },
  get(userId) {
    const entry = cache.get(userId);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      cache.delete(userId);
      return null;
    }
    return entry.data;
  },
  clear(userId) {
    cache.delete(userId);
  }
};