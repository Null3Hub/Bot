const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const KeyService = require('../../../../services/store/keyService');
const AuditService = require('../../../../services/store/auditService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shopimport')
    .setDescription('Add keys to an existing product (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('productid').setDescription('Product ID').setRequired(true))
    .addStringOption(opt => opt.setName('keys').setDescription('Keys separated by new line').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const productId = interaction.options.getString('productid');
    const keysRaw = interaction.options.getString('keys');
    const keys = keysRaw.split('\n').map(k => k.trim()).filter(k => k.length > 0);

    if (keys.length === 0) return interaction.editReply('❌ No valid keys provided.');

    const result = await KeyService.addStock(productId, keys);
    if (!result.success) return interaction.editReply(`❌ ${result.error}`);

    AuditService.log(interaction.client, 'ADD_STOCK', { 
      productId, 
      added: result.added, 
      admin: interaction.user.username 
    });

    await interaction.editReply(`✅ Added **${result.added}** keys. New stock: **${result.newStock}**`);
  }
};
