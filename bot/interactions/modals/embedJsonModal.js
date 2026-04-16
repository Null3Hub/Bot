const { MessageFlags } = require('discord.js');
const embedCache = require('../../modules/embedCache');
const { jsonToEmbed } = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'modal_embed_input',
  async execute(interaction) {
    const jsonStr = interaction.fields.getTextInputValue('json_content');
    let json;

    try {
      json = JSON.parse(jsonStr);
      if (typeof json !== 'object' || Array.isArray(json)) throw new Error('JSON deve ser um objeto.');
      jsonToEmbed(json); // Teste de validação
    } catch (err) {
      return interaction.reply({ content: `❌ **Erro:** ${err.message}`, flags: MessageFlags.Ephemeral });
    }

    embedCache.set(interaction.user.id, json);

    await interaction.reply({
      content: '✅ JSON salvo com sucesso! Agora clique em **Preview**.',
      flags: MessageFlags.Ephemeral
    });
  }
};