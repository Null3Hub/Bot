const { buildInfoEmbed } = require('../../utils/embedBuilder');
let cachedInfoJson = '{"description":"ℹ️ Information not configured by admin."}';

module.exports = {
  customId: 'btn:info',
  getCachedJson: () => cachedInfoJson,
  setCachedJson: (json) => { cachedInfoJson = json; },
  async execute(interaction) {
    await interaction.reply({ embeds: [buildInfoEmbed(cachedInfoJson)], ephemeral: true });
  }
};
