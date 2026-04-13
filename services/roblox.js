// services/roblox.js
const cache = require('./cache'); // ✅ Importação necessária
const CACHE_TIME = 10 * 60 * 1000; // 10 minutos

async function getGameInfo(placeId, rawInput = null) {
  if (cache.has(placeId)) return cache.get(placeId);

  try {
    const uniRes = await fetch(
      `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
    );
    const uniData = await uniRes.json();
    const universeId = uniData?.universeId;
    if (!universeId) return { name: null, thumb: null };

    const [gameRes, thumbRes] = await Promise.all([
      fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`),
      fetch(`https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&size=512x512&format=Png`),
    ]);

    const gameData  = await gameRes.json();
    const thumbData = await thumbRes.json();

    // Tenta pegar nome limpo da URL, fallback para nome da API
    const nameFromUrl = rawInput ? extractNameFromUrl(rawInput) : null;
    const nameFromApi = gameData?.data?.[0]?.name || null;

    const result = {
      name:  nameFromUrl || nameFromApi || null,
      thumb: thumbData?.data?.[0]?.imageUrl || null,
    };

    cache.set(placeId, result);
    setTimeout(() => cache.delete(placeId), CACHE_TIME);

    return result;
  } catch (err) {
    console.error('[ROBLOX SERVICE ERROR]', err);
    return { name: null, thumb: null };
  }
}

function extractNameFromUrl(input) {
  const match = input.match(/roblox\.com\/games\/\d+\/([^?/]+)/);
  if (!match) return null;
  return match[1].replace(/-/g, ' ');
}

module.exports = { getGameInfo }; // ✅ Exportação necessária
