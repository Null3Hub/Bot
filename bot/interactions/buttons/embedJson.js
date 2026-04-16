const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const embedCache = require('../../modules/embedCache');

module.exports = {
  customId: 'btn_embed_json',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('modal_embed_input').setTitle('Configurar Embed JSON');

    const currentData = embedCache.get(interaction.user.id);
    
    const jsonInput = new TextInputBuilder()
      .setCustomId('json_content')
      .setLabel('Cole seu JSON aqui')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('{"title": "Título", "color": "#ff0000"}')
      .setRequired(true);

    if (currentData) {
      jsonInput.setValue(JSON.stringify(currentData, null, 2));
    }

    modal.addComponents(new ActionRowBuilder().addComponents(jsonInput));
    await interaction.showModal(modal);
  }
};