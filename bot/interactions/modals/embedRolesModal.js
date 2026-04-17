const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const embedCache = require('../../modules/embedCache');
const { jsonToEmbed } = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'modal_embed_roles',
  async execute(interaction) {
    const roleId = interaction.fields.getTextInputValue('role_id').trim();
    const buttonLabel = interaction.fields.getTextInputValue('button_label').trim();
    const buttonEmoji = interaction.fields.getTextInputValue('button_emoji').trim();

    // Valida se o cargo existe no servidor
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) {
      return interaction.reply({
        content: `❌ Cargo com ID \`${roleId}\` não encontrado neste servidor. Verifique o ID.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const data = embedCache.get(interaction.user.id);
    if (!data) {
      return interaction.reply({
        content: '❌ Sessão expirada. Use /setembed novamente.',
        flags: MessageFlags.Ephemeral,
      });
    }

    // Salva configuração de role no cache junto com o embed
    embedCache.set(interaction.user.id, {
      ...data,
      _roleConfig: {
        roleId,
        buttonLabel,
        buttonEmoji: buttonEmoji || null,
      },
    });

    const embed = jsonToEmbed(data);

    // Monta preview com botão de Get Role já visível
    const embedRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_embed_edit')
        .setLabel('✏️ Edit JSON')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('btn_embed_roles')
        .setLabel('🎭 Edit Role')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('btn_embed_send')
        .setLabel('🚀 Send to Channel')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('btn_embed_cancel')
        .setLabel('🗑️ Cancel')
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.deferUpdate();
    await interaction.editReply({
      content: `✅ Cargo **${role.name}** configurado! Botão: **${buttonLabel}**\nClique em **Send to Channel** para enviar.`,
      embeds: [embed],
      components: [embedRow],
    });
  },
};