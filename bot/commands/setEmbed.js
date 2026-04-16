const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setembed')
    .setDescription('Abre o painel de criação de embed'),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('embed:json').setLabel('📝 Set JSON').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('embed:preview').setLabel('👁️ Preview').setStyle(ButtonStyle.Secondary).setDisabled(true)
    );

    await interaction.reply({
      content: '🛠️ **Embed Builder**\nClique em **Set JSON** para colar o código do embed.',
      components: [row],
      flags: MessageFlags.Ephemeral
    });
  }
};