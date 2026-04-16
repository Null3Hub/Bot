const { MessageFlags } = require('discord.js');
const embedCache = require('../../modules/embedCache');

module.exports = {
  customId: 'btn_embed_cancel',
  async execute(interaction) {
    embedCache.delete(interaction.user.id);
    await interaction.reply({ content: '🗑️ Sessão cancelada.', flags: MessageFlags.Ephemeral });
  }
};