const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendEmbedPanel } = require('../modules/setEmbedSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setembed')
    .setDescription('Send a custom embed to any channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await sendEmbedPanel(interaction);
  }
};