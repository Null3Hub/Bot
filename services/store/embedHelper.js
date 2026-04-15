const { EmbedBuilder } = require('discord.js');

function buildProductEmbed(product, isPurchaseView = false) {
  const statusColor = product.isActive ? 0x57f287 : 0xed4245;
  const embed = new EmbedBuilder()
    .setTitle(`🛍️ ${product.name}`)
    .setDescription(product.description || '*No description provided.*')
    .setColor(statusColor)
    .addFields(
      { name: '💰 Price', value: `${product.currency} ${product.price.toFixed(2)}`, inline: true },
      { name: '📦 Stock', value: `${product.stock} available`, inline: true },
      { name: '🏷️ Category', value: product.category, inline: true }
    )
    .setFooter({ text: `ID: ${product.productId}` })
    .setTimestamp();

  if (product.image) embed.setThumbnail(product.image);
  return embed;
}

function buildInventoryEmbed(items) {
  const embed = new EmbedBuilder().setTitle('🔑 Your Inventory').setColor(0x0000ff);
  if (!items.length) {
    embed.setDescription('You have no purchased keys yet.');
    return embed;
  }
  const fields = [];
  for (let i = 0; i < items.length; i += 10) {
    fields.push({
      name: `Items ${i + 1} - ${Math.min(i + 10, items.length)}`,
      value: items.slice(i, i + 10).map(item => `**${item.productName}**\n\`${item.key}\``).join('\n'),
      inline: false
    });
  }
  embed.addFields(fields);
  return embed;
}

function buildTransactionEmbed(transactions) {
  const embed = new EmbedBuilder().setTitle('🧾 Recent Transactions').setColor(0xffaa00);
  if (!transactions.length) {
    embed.setDescription('No recent transactions found.');
    return embed;
  }
  const fields = [];
  for (let i = 0; i < transactions.length; i += 5) {
    fields.push({
      name: `Last ${transactions.length - i} Transactions`,
      value: transactions.slice(i, i + 5).map(tx => `✅ \`${tx.productName}\` - ${tx.price} ${tx.currency}`).join('\n'),
      inline: false
    });
  }
  embed.addFields(fields);
  return embed;
}

module.exports = { buildProductEmbed, buildInventoryEmbed, buildTransactionEmbed };
