const { MessageFlags } = require('discord.js');

module.exports = {
  customId: 'select:lang',
  async execute(interaction) {
    const selectedLang = interaction.values[0];
    const ticketState = require('../../modules/ticketState');
    ticketState.set(interaction.user.id, 'lang', selectedLang);

    const { getPaymentMenu } = require('../../modules/ticketSystem');
    const langs = require('../../config/languages.json');

    await interaction.update({
      content: langs[selectedLang]?.paymentPlaceholder || '💳 Select payment method:',
      components: [getPaymentMenu(selectedLang)]
    });
  }
};
