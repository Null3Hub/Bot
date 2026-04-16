// modules/setEmbedSystem.js
const cache = new Map();

function setCache(userId, data) {
  cache.set(userId, { ...data, timestamp: Date.now() });
}

function getCache(userId) {
  const entry = cache.get(userId);
  if (!entry) return null;
  // Expira após 15 minutos
  if (Date.now() - entry.timestamp > 15 * 60 * 1000) {
    cache.delete(userId);
    return null;
  }
  return entry;
}

async function sendEmbedPanel(interaction) {
  const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
  
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('setembed:set_json')
      .setLabel('Set JSON')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('setembed:send')
      .setLabel('Send to Channel')
      .setStyle(ButtonStyle.Success)
  );

  await interaction.reply({
    content: 'Configure your embed:',
    components: [row],
    ephemeral: true
  });
}

module.exports = { setCache, getCache, sendEmbedPanel };