const { MessageFlags } = require('discord.js');
const cache = require('../../modules/embedCache');
const jsonToEmbed = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'modal:embed_json',
  async execute(interaction) {
    const rawJson = interaction.fields.getTextInputValue('json_input');
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('JSON deve ser um objeto.');
      // Valida estrutura antes de salvar para evitar erro no preview
      jsonToEmbed(parsed);
    } catch (err) {
      return interaction.reply({ content: `❌ JSON inválido: ${err.message}`, flags: MessageFlags.Ephemeral });
    }

    cache.set(interaction.user.id, parsed);
    await interaction.reply({ content: '✅ JSON salvo! Clique em **Preview** para visualizar.', flags: MessageFlags.Ephemeral });
  }
};