const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const cache = require('../../modules/embedCache');

module.exports = {
  customId: 'embed:edit',
  async execute(interaction) {
    const data = cache.get(interaction.user.id);
    const jsonStr = data ? JSON.stringify(data, null, 2) : '';

    const modal = new ModalBuilder()
      .setCustomId('modal:embed_json')
      .setTitle('Edite o JSON do Embed');
      
    const input = new TextInputBuilder()
      .setCustomId('json_input')
      .setLabel('JSON do Embed')
      .setStyle(TextInputStyle.Paragraph)
      .setValue(jsonStr)
      .setPlaceholder('Edite o JSON aqui...')
      .setRequired(true);
      
    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  }
};