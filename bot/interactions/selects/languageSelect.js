const { MessageFlags } = require('discord.js');

module.exports = {
  customId: 'language_select', // Deve bater com o customId do seu menu
  async execute(interaction) {
    const selectedLang = interaction.values[0];
    // Lógica de definição de idioma (ex: salvar em cache ou DB)
    await interaction.reply({ 
      content: `✅ Idioma definido para: \`${selectedLang}\`.`, 
      flags: MessageFlags.Ephemeral 
    });
  }
};
