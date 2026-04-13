const cache = new Map();

function get(key) {
  if (!cache.has(key)) return null;
  const { value, expires } = cache.get(key);
  if (Date.now() > expires) {
    cache.delete(key);
    return null;
  }
  return value;
}

function set(key, value, ttl = 60000) { // 60s padrão
  cache.set(key, { value, expires: Date.now() + ttl });
}

module.exports = { get, set };
