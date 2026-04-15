const { EmbedBuilder } = require('discord.js');
const config = require('../config/ticketConfig.json');

function buildPanelEmbed(data) {
  const embed = new EmbedBuilder()
    .setTitle(data.title || '🎫 Support & Sales Panel')
    .setDescription(data.description || 'Click below to open a ticket.')
    .setColor(data.color || '#000000');

  if (data.thumbnail) embed.setThumbnail(data.thumbnail);
  if (data.image) embed.setImage(data.image);
  
  embed.setFooter({ text: config.footerText.replace('{date}', new Date().toLocaleDateString()) });
  return embed;
}

function buildInfoEmbed(jsonData) {
  try {
    return new EmbedBuilder().setAuthor({ name: 'ℹ️ Information' }).setDescription(JSON.parse(jsonData).description || jsonData);
  } catch {
    return new EmbedBuilder().setDescription('❌ Invalid JSON format.');
  }
}

module.exports = { buildPanelEmbed, buildInfoEmbed };