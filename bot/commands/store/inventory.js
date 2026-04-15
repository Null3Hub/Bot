const { SlashCommandBuilder } = require('discord.js');
const Inventory = require('../../../models/store/Inventory');
const { buildInventoryEmbed } = require('../../../services/store/embedHelper');

module.exports = {
   new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your purchased keys.')
    .addUserOption(opt => opt.setName('user').setDescription('View inventory of another user (Admin only)').setRequired(false)),
  
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const items = await Inventory.find({ userId: targetUser.id, status: 'active' }).sort({ purchasedAt: -1 }).limit(20);
    
    await interaction.reply({ embeds: [buildInventoryEmbed(items)], flags: MessageFlags.Ephemeral });
  }
};
