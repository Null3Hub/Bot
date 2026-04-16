const { MessageFlags } = require('discord.js');

module.exports = {
  customId: 'btn_embed_cancel',
  async execute(interaction) {
    // Fecha/deleta a mensagem do painel embed
    await interaction.reply({
      content: '❌ Configuração de embed cancelada.',
      flags: MessageFlags.Ephemeral
    });
    
    // Opcional: deletar a mensagem original após 5s
    setTimeout(() => {
      interaction.message.delete().catch(() => {});
    }, 5000);
  }
};