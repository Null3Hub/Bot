const state = new Map();
const EXPIRY = 120000; // 2 min

module.exports = {
  get: (userId) => state.get(userId),
  set: (userId, key, value) => {
    if (!state.has(userId)) {
      state.set(userId, { lang: null, payment: null, timeout: null });
    }
    const userState = state.get(userId);
    userState[key] = value;
    
    if (userState.timeout) clearTimeout(userState.timeout);
    userState.timeout = setTimeout(() => state.delete(userId), EXPIRY);
  },
  clear: (userId) => state.delete(userId)
};