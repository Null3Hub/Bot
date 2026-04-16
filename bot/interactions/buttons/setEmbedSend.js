const { EmbedBuilder, MessageFlags } = require('discord.js');
const { getCache } = require('../../modules/setEmbedSystem');

module.exports = {
  customId: 'setembed:send',
  async execute(interaction) {
    const data = getCache(interaction.user.id);

    if (!data) {
      return interaction.reply({
        content: '❌ No JSON configured yet. Click **Set JSON** first.',
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder();

    if (data.title)       embed.setTitle(data.title);
    if (data.description) embed.setDescription(data.description);
    if (data.color)       embed.setColor(data.color);
    if (data.thumbnail)   embed.setThumbnail(data.thumbnail);
    if (data.image)       embed.setImage(data.image);
    if (data.footer)      embed.setFooter({ text: data.footer });
    if (data.timestamp)   embed.setTimestamp();

    if (Array.isArray(data.fields)) {
      for (const field of data.fields) {
        if (field.name && field.value) {
          embed.addFields({ name: field.name, value: field.value, inline: field.inline || false });
        }
      }
    }

    await interaction.channel.send({ embeds: [embed] });

    await interaction.reply({
      content: '✅ Embed sent successfully!',
      flags: MessageFlags.Ephemeral,
    });
  }
};