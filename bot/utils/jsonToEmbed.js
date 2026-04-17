const { EmbedBuilder } = require('discord.js');

function jsonToEmbed(data) {
  const embed = new EmbedBuilder();

  if (data.title) embed.setTitle(data.title);
  if (data.description) embed.setDescription(data.description);
  if (data.url) embed.setURL(data.url);
  
  // Suporte a cores (Hex String ou Inteiro) — data.color !== undefined cobre color: 0 (preto)
  if (data.color !== undefined && data.color !== null) {
    if (typeof data.color === 'string' && data.color.startsWith('#')) {
      embed.setColor(parseInt(data.color.slice(1), 16));
    } else {
      embed.setColor(data.color);
    }
  }
  
  if (data.footer) {
    embed.setFooter({ text: data.footer.text, iconURL: data.footer.icon_url || data.footer.iconURL });
  }
  
  if (data.thumbnail) {
    embed.setThumbnail(data.thumbnail.url || data.thumbnail);
  }
  
  if (data.image) {
    embed.setImage(data.image.url || data.image);
  }
  
  if (data.author) {
    embed.setAuthor({ name: data.author.name, iconURL: data.author.icon_url || data.author.iconURL, url: data.author.url });
  }

  if (data.fields && Array.isArray(data.fields)) {
    const validFields = data.fields.filter(f => f.name && f.value);
    if (validFields.length > 0) {
      embed.addFields(validFields.map(f => ({
        name: String(f.name).substring(0, 256),
        value: String(f.value).substring(0, 1024),
        inline: !!f.inline
      })));
    }
  }

  if (data.timestamp) {
    embed.setTimestamp(data.timestamp === true ? Date.now() : data.timestamp);
  }

  return embed;
}

module.exports = { jsonToEmbed };