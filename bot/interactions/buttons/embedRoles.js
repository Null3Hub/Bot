const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags,
} = require('discord.js');
const embedCache = require('../../modules/embedCache');

module.exports = {
  customId: 'btn_embed_roles',
  async execute(interaction) {
    const data = embedCache.get(interaction.user.id);
    if (!data)
      return interaction.reply({
        content: '⚠️ Configure o JSON primeiro.',
        flags: MessageFlags.Ephemeral,
      });

    const modal = new ModalBuilder()
      .setCustomId('modal_embed_roles')
      .setTitle('Configurar Get Role');

    const roleIdInput = new TextInputBuilder()
      .setCustomId('role_id')
      .setLabel('ID do Cargo')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 1234567890123456789')
      .setRequired(true);

    const buttonLabelInput = new TextInputBuilder()
      .setCustomId('button_label')
      .setLabel('Label do Botão')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 🔔 Pegar Cargo')
      .setMaxLength(80)
      .setRequired(true);

    const buttonEmojiInput = new TextInputBuilder()
      .setCustomId('button_emoji')
      .setLabel('Emoji (opcional)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 🔔  ou deixe vazio')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(roleIdInput),
      new ActionRowBuilder().addComponents(buttonLabelInput),
      new ActionRowBuilder().addComponents(buttonEmojiInput),
    );

    await interaction.showModal(modal);
  },
};