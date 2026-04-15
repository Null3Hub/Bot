const sendPanelBtn = require('../buttons/sendPanel');

module.exports = {
  customId: 'modal:embed_config',
  async execute(interaction) {
    const data = {
      title: interaction.fields.getTextInputValue('title'),
      description: interaction.fields.getTextInputValue('description'),
      color: interaction.fields.getTextInputValue('color') || '#000000',
      thumbnail: interaction.fields.getTextInputValue('thumbnail') || null
    };
    sendPanelBtn.setCachedData(data);
    await interaction.reply({ content: '✅ Embed data saved. Click "Send to Channel" when ready.', ephemeral: true });
  }
};