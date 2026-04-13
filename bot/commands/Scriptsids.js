const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Script = require('../../models/Script');

const STATUS_EMOJI = {
  active: '🟢',
  maintenance: '🟡',
  discontinued: '🔴'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scriptids')
    .setDescription('Lista todos os scripts e seus IDs'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const scripts = await Script.find().sort({ createdAt: -1 }).lean();

    if (!scripts.length) {
      return interaction.editReply('❌ Nenhum script cadastrado.');
    }

    const pageSize = 10;
    const pages = [];

    for (let i = 0; i < scripts.length; i += pageSize) {
      const chunk = scripts.slice(i, i + pageSize);
      const lines = chunk.map(s => {
        const emoji = STATUS_EMOJI[s.status] || '⚪';
        return `${emoji} **${s.name}**\n> ID: \`${s.id}\`\n> PlaceId: \`${s.placeId}\``;
      });

      const embed = new EmbedBuilder()
        .setTitle(`📋 Script IDs — Página ${pages.length + 1}`)
        .setColor(0x000000)
        .setDescription(lines.join('\n\n'))
        .setFooter({ text: `Total: ${scripts.length} scripts` })
        .setTimestamp();

      pages.push(embed);
    }

    await interaction.editReply({ embeds: [pages[0]] });

    for (let i = 1; i < pages.length; i++) {
      await interaction.followUp({ embeds: [pages[i]], ephemeral: true });
    }
  }
};
