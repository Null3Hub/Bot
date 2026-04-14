const { SlashCommandBuilder } = require('discord.js');
const { commitScript } = require('../../services/github');
const Script = require('../../models/Script');
const { buildUpdateEmbed } = require('../../services/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update')
    .setDescription('Atualiza script existente')
    .addStringOption(o => o.setName('scriptid').setDescription('ID do script').setRequired(true))
    .addStringOption(o => o.setName('description').setDescription('Descrição').setRequired(true))
    .addAttachmentOption(o => o.setName('file').setDescription('Novo arquivo (opcional)').setRequired(false)),

  async execute(interaction) {
    // ✅ Resposta ephemeral — só o usuário vê
    await interaction.deferReply({ ephemeral: true });

    const scriptId   = interaction.options.getString('scriptid');
    const description = interaction.options.getString('description');
    const file        = interaction.options.getAttachment('file');

    const script = await Script.findOne({ id: scriptId });
    if (!script) return interaction.editReply('❌ Script não encontrado. Verifique o ID.');

    let rawUrl     = script.rawUrl;
    let newVersion = script.version;

    // Se enviou arquivo novo, commita no GitHub
    if (file) {
      const content = await fetch(file.url).then(r => r.text());
      try {
        const githubResult = await commitScript({
          placeId:  script.placeId,
          content:  content,
          gameName: script.name
        });
        rawUrl = githubResult.rawUrl;
        newVersion++;
      } catch (err) {
        console.error('[UPDATE] GitHub error:', err);
        return interaction.editReply('❌ Falha ao enviar arquivo para o GitHub.');
      }
    }

    // Atualiza MongoDB
    script.rawUrl  = rawUrl;
    script.version = newVersion;
    script.logs.push({
      type:        'update',
      description,
      date:        new Date(),
      by:          interaction.user.id,
      version:     newVersion
    });
    await script.save();

    const embed = buildUpdateEmbed({ script, description, user: interaction.user });

    // ✅ Envia embed no mesmo canal que o /addscript
    const channel = interaction.client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) await channel.send({ embeds: [embed] });

    // ✅ Resposta privada para o usuário
    await interaction.editReply({
      content: `✅ Script **${script.name}** atualizado para v${newVersion}!`
    });
  }
};
