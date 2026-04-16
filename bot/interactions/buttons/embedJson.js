const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'embed:json',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('modal:embed_json')
      .setTitle('Insira o JSON do Embed');
    
    const input = new TextInputBuilder()
      .setCustomId('json_input')
      .setLabel('JSON do Embed')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('{"title":"Olá","description":"Teste..."}')
      .setRequired(true);
      
    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  }
};