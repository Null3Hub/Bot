const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const embedCache = require('../../modules/embedCache');

module.exports = {
  customId: 'btn_embed_edit',
  async execute(interaction) {
    const data = embedCache.get(interaction.user.id);
    if (!data) return interaction.reply({ content: '⚠️ Nada para editar.', ephemeral: true });

    const modal = new ModalBuilder().setCustomId('modal_embed_input').setTitle('Editar Embed JSON');
    const input = new TextInputBuilder()
      .setCustomId('json_content')
      .setLabel('Edite o JSON')
      .setStyle(TextInputStyle.Paragraph)
      .setValue(JSON.stringify(data, null, 2))
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  }
};