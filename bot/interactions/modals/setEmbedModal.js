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
        content: '❌ JSON inválido. Verifique a sintaxe e tente novamente.',
        flags: MessageFlags.Ephemeral,
      });
    }

    setCache(interaction.user.id, parsed);

    await interaction.reply({
      content: '✅ JSON salvo! Clique em **Send to Channel** para publicar.',
      flags: MessageFlags.Ephemeral,
    });
  }
};