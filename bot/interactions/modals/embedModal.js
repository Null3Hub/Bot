const { MessageFlags } = require('discord.js');
const sendPanelBtn = require('../buttons/sendPanel');

module.exports = {
  customId: 'modal:embed_config',
  async execute(interaction) {
    try {
      const data = {
        title: interaction.fields.getTextInputValue('title'),
        description: interaction.fields.getTextInputValue('description'),
        color: interaction.fields.getTextInputValue('color') || '#000000',
        thumbnail: interaction.fields.getTextInputValue('thumbnail') || null
      };

      sendPanelBtn.setCachedData(data);

      if (interaction.replied || interaction.deferred) return;

      await interaction.reply({
        content: '✅ Embed data saved. Click "Send to Channel" when ready.',
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      if (err.code === 10062) return; // interação expirada, ignora
      console.error('[embedModal] Erro inesperado:', err);
    }
  }
};