const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  customId: 'setembed:set_json',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('setembed:modal_json')
      .setTitle('Custom Embed JSON');

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('embed_json')
          .setLabel('Embed JSON')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('{"title":"Hello","description":"World","color":"#000000"}')
          .setRequired(true)
      )
    );

    await interaction.showModal(modal);
  }
};