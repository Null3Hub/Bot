const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  MessageFlags,
} = require('discord.js');
const embedCache = require('../modules/embedCache');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setembed')
    .setDescription('Abre o painel de criação de embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    embedCache.delete(interaction.user.id);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_embed_json')
        .setLabel('1. Set JSON')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('btn_embed_preview')
        .setLabel('2. Preview')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('btn_embed_roles')
        .setLabel('3. Get Role (opcional)')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('btn_embed_cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.reply({
      content:
        '🛠️ **Painel de Embed**\nClique em **1. Set JSON** para começar.\nApós o preview, o botão **Get Role** ficará disponível para adicionar um cargo clicável ao embed.',
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  },
};