const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embedCache = require('../../modules/embedCache');
const { jsonToEmbed } = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'modal_embed_input',
  async execute(interaction) {
    const jsonStr = interaction.fields.getTextInputValue('json_content');
    let json;

    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('JSON deve ser um objeto.');

      json = Array.isArray(parsed.embeds) ? parsed.embeds[0] : parsed;
      if (!json || typeof json !== 'object') throw new Error('Embed inválido no JSON.');

      jsonToEmbed(json);
    } catch (err) {
      return interaction.reply({ content: `❌ **Erro:** ${err.message}`, flags: MessageFlags.Ephemeral });
    }

     embedCache.set(interaction.user.id, json);
     
     const row = new ActionRowBuilder().addComponents(
       new ButtonBuilder().setCustomId('btn_embed_json').setLabel('1. Set JSON').setStyle(ButtonStyle.Primary),
       new ButtonBuilder().setCustomId('btn_embed_preview').setLabel('2. Preview').setStyle(ButtonStyle.Secondary).setDisabled(false),
       new ButtonBuilder().setCustomId('btn_embed_cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger)
     );

// Modal submit não suporta .update() — usar deferUpdate + edit na mensagem original
await interaction.deferUpdate();
await interaction.message.edit({
  content: '🛠️ **Painel de Embed**\n✅ JSON salvo! Clique em **2. Preview** para visualizar.',
  components: [row]
});
