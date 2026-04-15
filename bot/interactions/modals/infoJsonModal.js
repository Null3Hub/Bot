const infoBtn = require('../buttons/infoButton');

module.exports = {
  customId: 'modal:info_json',
  async execute(interaction) {
    const json = interaction.fields.getTextInputValue('json');
    try { JSON.parse(json); infoBtn.setCachedJson(json); } catch {
      return interaction.reply({ content: '❌ Invalid JSON. Please fix format.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Info JSON saved!', ephemeral: true });
  }
};
