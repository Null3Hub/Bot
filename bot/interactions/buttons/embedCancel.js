const { MessageFlags } = require('discord.js');
const cache = require('../../modules/embedCache');

module.exports = {
  customId: 'embed:cancel',
  async execute(interaction) {
    cache.clear(interaction.user.id);
    await interaction.update({ content: '🚫 Preview cancelado.', embeds: [], components: [] });
    await interaction.followUp({ content: '🗑️ Cache limpo com sucesso.', flags: MessageFlags.Ephemeral });
  }
};