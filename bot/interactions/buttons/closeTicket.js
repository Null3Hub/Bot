const langs = require('../../config/languages.json');

module.exports = {
  customId: 'btn:close_ticket',
  async execute(interaction) {
    const channel = interaction.channel;
    await interaction.reply({ content: '🔒 Ticket marked for closure. Archiving in 5s...', ephemeral: true });
    setTimeout(async () => {
      await channel.send('📦 Ticket archived. You can reopen a new one anytime.').catch(() => {});
      await channel.delete().catch(() => {});
    }, 5000);
  }
};
