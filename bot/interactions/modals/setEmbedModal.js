const { MessageFlags } = require('discord.js');
const { setCache } = require('../../modules/setEmbedSystem');

module.exports = {
  customId: 'setembed:modal_json',
  async execute(interaction) {
    const raw = interaction.fields.getTextInputValue('embed_json');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return interaction.reply({
        content: '❌ Invalid JSON. Please fix the format and try again.',
        flags: MessageFlags.Ephemeral,
      });
    }

    setCache(interaction.user.id, parsed);

    await interaction.reply({
      content: '✅ JSON saved! Now click **Send to Channel** to publish the embed.',
      flags: MessageFlags.Ephemeral,
    });
  }
};