const { SlashCommandBuilder } = require('discord.js');
const Script = require('../../models/Script');
const { buildStatusEmbed } = require('../../services/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Muda o status do script')
    .addStringOption(o => o.setName('scriptid').setDescription('ID').setRequired(true))
    .addStringOption(o => o.setName('status').setDescription('Status').setRequired(true)
      .addChoices(
        { name: 'Active', value: 'active' },
        { name: 'Maintenance', value: 'maintenance' },
        { name: 'Discontinued', value: 'discontinued' }
      )),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const scriptId = interaction.options.getString('scriptid');
    const newStatus = interaction.options.getString('status');

    const script = await Script.findOne({ id: scriptId });
    if (!script) return interaction.editReply('❌ Não encontrado.');

    const oldStatus = script.status;
    script.status = newStatus;
    script.logs.push({ type: 'status', from: oldStatus, to: newStatus, by: interaction.user.id });
    await script.save();

    const embed = buildStatusEmbed({ script, oldStatus, newStatus, user: interaction.user });
    await interaction.editReply({ embeds: [embed] });
  }
};
