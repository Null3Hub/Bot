const { EmbedBuilder } = require('discord.js');

module.exports = function jsonToEmbed(json) {
  const embed = new EmbedBuilder();

  if (json.title) embed.setTitle(String(json.title));
  if (json.description) embed.setDescription(String(json.description));
  if (json.color) embed.setColor(json.color); // Suporta #HEX, 0xHEX, int ou CSS colors
  if (json.timestamp) embed.setTimestamp(new Date(json.timestamp));
  if (json.url) embed.setURL(String(json.url));

  // Thumbnail (string ou objeto)
  if (json.thumbnail) {
    embed.setThumbnail(typeof json.thumbnail === 'string' ? json.thumbnail : String(json.thumbnail.url));
  }

  // Image (string ou objeto)
  if (json.image) {
    embed.setImage(typeof json.image === 'string' ? json.image : String(json.image.url));
  }

  // Footer (string ou objeto)
  if (json.footer) {
    const text = typeof json.footer === 'string' ? json.footer : String(json.footer.text);
    const icon = typeof json.footer === 'object' ? String(json.footer.icon_url) : undefined;
    if (text) embed.setFooter({ text, iconURL: icon });
  }

  // Author (string ou objeto)
  if (json.author) {
    const name = typeof json.author === 'string' ? json.author : String(json.author.name);
    if (name) {
      embed.setAuthor({
        name,
        iconURL: typeof json.author === 'object' ? String(info.author.icon_url) : undefined,
        url: typeof json.author === 'object' ? String(info.author.url) : undefined
      });
    }
  }

  // Fields array
  if (Array.isArray(json.fields)) {
    embed.addFields(
      json.fields
        .filter(f => f.name && f.value) // Filtra campos vazios para evitar crash do Discord
        .map(f => ({ name: String(f.name), value: String(f.value), inline: !!f.inline }))
    );
  }

  return embed;
};