const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const cache = require('../../modules/embedCache');
const jsonToEmbed = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'embed:preview',
  async execute(interaction) {
    const data = cache.get(interaction.user.id);
    if (!data) return interaction.reply({ content: '⚠️ Nenhum JSON salvo. Use **Set JSON** primeiro.', flags: MessageFlags.Ephemeral });

    let embed;
    try {
      embed = jsonToEmbed(data);
    } catch (err) {
      return interaction.reply({ content: `❌ Erro ao gerar preview: ${err.message}`, flags: MessageFlags.Ephemeral });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('embed:send').setLabel('✅ Send').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('embed:edit').setLabel('✏️ Edit').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed:cancel').setLabel('❌ Cancel').setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
  }
};