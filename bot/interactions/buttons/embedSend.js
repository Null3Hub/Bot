const { MessageFlags } = require('discord.js');
const cache = require('../../modules/embedCache');
const jsonToEmbed = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'embed:send',
  async execute(interaction) {
    const data = cache.get(interaction.user.id);
    if (!data) return interaction.reply({ content: '⚠️ Sessão expirada. Gere um novo embed.', flags: MessageFlags.Ephemeral });

    try {
      const embed = jsonToEmbed(data);
      await interaction.channel.send({ embeds: [embed] });
      await interaction.reply({ content: '✅ Embed enviado com sucesso para o canal!', flags: MessageFlags.Ephemeral });
      cache.clear(interaction.user.id);
    } catch (err) {
      await interaction.reply({ content: `❌ Falha ao enviar: ${err.message}`, flags: MessageFlags.Ephemeral });
    }
  }
};