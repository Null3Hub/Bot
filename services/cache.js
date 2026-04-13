const cache = new Map();

function has(key) {
  if (!cache.has(key)) return false;
  const { expires } = cache.get(key);
  if (Date.now() > expires) {
    cache.delete(key);
    return false;
  }
  return true;
}

function get(key) {
  if (!has(key)) return null;
  return cache.get(key).value;
}

function set(key, value, ttl = 60000) {
  cache.set(key, { value, expires: Date.now() + ttl });
}

function del(key) {
  cache.delete(key);
}

module.exports = { has, get, set, delete: del };
