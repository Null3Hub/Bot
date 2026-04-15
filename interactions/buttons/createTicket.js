const { getLangMenu } = require('../../modules/ticketSystem');
const ticketState = require('../../modules/ticketState');

module.exports = {
  customId: 'btn:create_ticket',
  async execute(interaction) {
    ticketState.set(interaction.user.id, 'start', Date.now());
    await interaction.reply({ content: '🌍 Select your preferred language first:', components: [getLangMenu()], ephemeral: true });
  }
};