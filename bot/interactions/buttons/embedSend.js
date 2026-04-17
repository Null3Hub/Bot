const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const embedCache = require('../../modules/embedCache');
const { jsonToEmbed } = require('../../utils/jsonToEmbed');

module.exports = {
  customId: 'btn_embed_send',
  async execute(interaction) {
    const data = embedCache.get(interaction.user.id);
    if (!data)
      return interaction.reply({
        content: '❌ Configure o JSON antes de enviar.',
        flags: MessageFlags.Ephemeral,
      });

    try {
      const embed = jsonToEmbed(data);
      const roleConfig = data._roleConfig || null;

      const messagePayload = { embeds: [embed] };

      // Se tiver role configurada, adiciona botão de get role na mensagem enviada
      if (roleConfig) {
        const btn = new ButtonBuilder()
          .setCustomId(`get_role:${roleConfig.roleId}`)
          .setLabel(roleConfig.buttonLabel)
          .setStyle(ButtonStyle.Secondary);

        if (roleConfig.buttonEmoji) {
          btn.setEmoji(roleConfig.buttonEmoji);
        }

        messagePayload.components = [new ActionRowBuilder().addComponents(btn)];
      }

      await interaction.channel.send(messagePayload);

      embedCache.delete(interaction.user.id);

      await interaction.reply({
        content: '✅ Embed enviado com sucesso!',
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error('[embedSend]', error);
      await interaction.reply({
        content: '❌ Erro ao enviar (verifique permissões ou JSON inválido).',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};