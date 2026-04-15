const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const Transaction = require('../../../models/store/Transaction');
const { buildTransactionEmbed } = require('../../../services/store/embedHelper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mytransactions')
    .setDescription('View your purchase history.')
    .addIntegerOption(opt => opt.setName('limit').setDescription('Number of transactions to show').setMinValue(1).setMaxValue(50)),
  
  async execute(interaction) {
    const limit = interaction.options.getInteger('limit') || 10;
    const txs = await Transaction.find({ userId: interaction.user.id }).sort({ createdAt: -1 }).limit(limit);
    await interaction.reply({ embeds: [buildTransactionEmbed(txs)], flags: MessageFlags.Ephemeral });
  }
};
