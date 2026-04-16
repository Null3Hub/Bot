const { MessageFlags } = require('discord.js');
const embedCache = require('../../modules/embedCache');
const { jsonToEmbed } = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'btn_embed_send',
  async execute(interaction) {
    const data = embedCache.get(interaction.user.id);
    if (!data) return interaction.reply({ content: '❌ Configure o JSON antes de enviar.', flags: MessageFlags.Ephemeral });

    try {
      const embed = jsonToEmbed(data);
      await interaction.channel.send({ embeds: [embed] });
      
      embedCache.delete(interaction.user.id);
      await interaction.reply({ content: '✅ Embed enviado com sucesso!', flags: MessageFlags.Ephemeral });
    } catch (error) {
      await interaction.reply({ content: '❌ Erro ao enviar (verifique permissões).', flags: MessageFlags.Ephemeral });
    }
  }
};