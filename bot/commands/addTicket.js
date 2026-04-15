const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendConfigPanel } = require('../modules/panelSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addticket')
    .setDescription('Open admin ticket configuration panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await sendConfigPanel(interaction);
  }
};