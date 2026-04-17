const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require('discord.js');
const embedCache = require('../../modules/embedCache');
const { jsonToEmbed } = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'btn_embed_preview',
  async execute(interaction) {
    const data = embedCache.get(interaction.user.id);
    if (!data)
      return interaction.reply({
        content: '⚠️ Configure o JSON primeiro.',
        flags: MessageFlags.Ephemeral,
      });

    try {
      const embed = jsonToEmbed(data);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('btn_embed_edit')
          .setLabel('✏️ Edit JSON')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('btn_embed_roles')
          .setLabel('🎭 Get Role')
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

      await interaction.update({ embeds: [embed], components: [row] });
    } catch (err) {
      await interaction.reply({
        content: `❌ Erro ao gerar preview: ${err.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};