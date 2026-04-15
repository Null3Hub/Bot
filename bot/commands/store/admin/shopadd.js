const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const Product = require('../../../../models/store/Product');
const { v4: uuidv4 } = require('uuid'); // Ensure uuid is in dependencies or use crypto.randomUUID()
const AuditService = require('../../../../services/store/auditService');

module.exports = {
   new SlashCommandBuilder()
    .setName('shopadd')
    .setDescription('Add a new product to the store (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('name').setDescription('Product name').setRequired(true))
    .addStringOption(opt => opt.setName('category').setDescription('Category').setRequired(true))
    .addNumberOption(opt => opt.setName('price').setDescription('Price').setRequired(true))
    .addStringOption(opt => opt.setName('keys').setDescription('Keys separated by new line').setRequired(true))
    .addStringOption(opt => opt.setName('description').setDescription('Product description').setRequired(false))
    .addStringOption(opt => opt.setName('image').setDescription('Thumbnail URL').setRequired(false)),
  
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const name = interaction.options.getString('name');
    const category = interaction.options.getString('category').toLowerCase();
    const price = interaction.options.getNumber('price');
    const keysRaw = interaction.options.getString('keys');
    const description = interaction.options.getString('description') || '';
    const image = interaction.options.getString('image') || null;

    const keys = keysRaw.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    if (keys.length === 0) return interaction.editReply('❌ No valid keys provided.');

    const productId = `PROD-${Date.now()}`;
    const product = new Product({ productId, name, category, price, description, image, stock: keys.length, keys });
    await product.save();

    AuditService.log(interaction.client, 'ADD_PRODUCT', { name, price, stock: keys.length, category, admin: interaction.user.username });
    interaction.editReply(`✅ Product **${name}** added with **${keys.length}** keys.`);
  }
};
