const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');
const Product = require('../../../models/store/Product');
const { buildProductEmbed } = require('../../../services/store/embedHelper');

module.exports = {
   data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Browse available products in the store.')
    .addStringOption(opt => opt.setName('category').setDescription('Filter by category').setRequired(false)),
  
  async execute(interaction) {
    const category = interaction.options.getString('category')?.toLowerCase();
    const query = category ? { category, isActive: true } : { isActive: true };
    const products = await Product.find(query).sort({ name: 1 });

    if (!products.length) return interaction.reply({ content: '❌ No products found.', flags: MessageFlags.Ephemeral });

    let page = 0;
    const maxPage = products.length - 1;

    const getComponents = (idx) => {
      const row = new ActionRowBuilder();
      if (maxPage > 0) {
        row.addComponents(
          new ButtonBuilder().setCustomId('prev').setStyle(ButtonStyle.Secondary).setEmoji('⬅️').setDisabled(idx === 0),
          new ButtonBuilder().setCustomId('next').setStyle(ButtonStyle.Secondary).setEmoji('➡️').setDisabled(idx === maxPage)
        );
      }
      row.addComponents(
        new ButtonBuilder().setCustomId('buy').setLabel('🛒 Buy Now').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('details').setLabel('📋 Details').setStyle(ButtonStyle.Primary)
      );
      return row;
    };

    const msg = await interaction.reply({
      embeds: [buildProductEmbed(products[page], true)],
      components: [getComponents(page)],
      fetchReply: true
    });

    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: '❌ Only the command executor can use this.', flags: MessageFlags.Ephemeral });

      if (i.customId === 'prev') page--;
      else if (i.customId === 'next') page++;
      else if (i.customId === 'buy') return i.deferUpdate(); // Handled in product.js or separate flow
      else if (i.customId === 'details') return i.reply({ content: `📝 ${products[page].description || 'No details.'}`, flags: MessageFlags.Ephemeral });

      await i.update({ embeds: [buildProductEmbed(products[page], true)], components: [getComponents(page)] });
    });
    collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));
  }
};
