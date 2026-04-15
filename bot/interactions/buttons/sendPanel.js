const { buildPanelEmbed } = require('../../utils/embedBuilder');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const infoBtn = require('./infoButton');

let cachedEmbedData = { title: '🎫 Support & Sales', description: 'Click to begin.' };

module.exports = {
  customId: 'panel:send',
  getCachedData: () => cachedEmbedData,
  setCachedData: (data) => { cachedEmbedData = data; },
  async execute(interaction) {
   const embed = buildPanelEmbed(cachedEmbedData);
   const row = new ActionRowBuilder().addComponents(
     new ButtonBuilder().setCustomId('btn:create_ticket').setLabel('🎫 Create a Ticket').setStyle(ButtonStyle.Primary),
     new ButtonBuilder().setCustomId('btn:info').setLabel('ℹ️ Just for Info').setStyle(ButtonStyle.Secondary)
   );
   await interaction.channel.send({ embeds: [embed], components: [row] });
   await interaction.reply({ content: '✅ Panel sent successfully!', ephemeral: true });
 }
};
