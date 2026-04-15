const { handlePaymentSelection } = require('../../modules/ticketSystem');

module.exports = {
  customId: 'select:payment',
  async execute(interaction) {
    await interaction.deferUpdate();
    await handlePaymentSelection(interaction);
  }
};
