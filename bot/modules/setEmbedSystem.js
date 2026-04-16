const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require('discord.js');

// Cache simples por userId — guarda o JSON enquanto o usuário configura
const embedCache = new Map();

function getCache(userId) {
  return embedCache.get(userId) || null;
}

function setCache(userId, data) {
  embedCache.set(userId, data);
  // Limpa após 10 minutos
  setTimeout(() => embedCache.delete(userId), 10 * 60 * 1000);
}

async function sendEmbedPanel(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('setembed:set_json')
      .setLabel('📝 Set JSON')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('setembed:send')
      .setLabel('📤 Send to Channel')
      .setStyle(ButtonStyle.Success)
  );

  await interaction.editReply({
    content: '🛠️ **Custom Embed Panel**\nPaste your JSON first, then send to channel.',
    components: [row],
  });
}

module.exports = { sendEmbedPanel, getCache, setCache };