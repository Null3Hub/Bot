const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { commitScript } = require('../../services/github');
const Script = require('../../models/Script');
const { buildUpdateEmbed } = require('../../services/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update')
    .setDescription('Atualiza script existente')
    .addStringOption(o =>
      o.setName('scriptid').setDescription('ID do script').setRequired(true),
    )
    .addStringOption(o =>
      o.setName('description').setDescription('Descrição').setRequired(true),
    )
    .addAttachmentOption(o =>
      o.setName('file').setDescription('Novo arquivo (opcional)').setRequired(false),
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const scriptId   = interaction.options.getString('scriptid');
    const description = interaction.options.getString('description');
    const file        = interaction.options.getAttachment('file');

    const script = await Script.findOne({ id: scriptId });
    if (!script) return interaction.editReply('❌ Script não encontrado. Verifique o ID.');

    let rawUrl     = script.rawUrl;
    let newVersion = script.version;

    if (file) {
      const content = await fetch(file.url).then(r => r.text());
      try {
        const githubResult = await commitScript({
          placeId:  script.placeId,
          content:  content,
          gameName: script.name,
        });
        rawUrl = githubResult.rawUrl;
        newVersion++;
      } catch (err) {
        console.error('[UPDATE] GitHub error:', err);
        return interaction.editReply('❌ Falha ao enviar arquivo para o GitHub.');
      }
    }

    script.rawUrl  = rawUrl;
    script.version = newVersion;
    script.logs.push({
      type:        'update',
      description,
      date:        new Date(),
      by:          interaction.user.id,
      version:     newVersion,
    });
    await script.save();

    const embed = buildUpdateEmbed({ script, description, user: interaction.user });

    // Busca ou cria cargo "update-ping" automaticamente
    let pingRole = interaction.guild.roles.cache.find(r => r.name === 'update-ping');
    if (!pingRole) {
      try {
        pingRole = await interaction.guild.roles.create({
          name: 'update-ping',
          mentionable: true,
          reason: 'Cargo criado automaticamente pelo sistema de update-ping',
        });
        console.log(`[UPDATE] Cargo update-ping criado: ${pingRole.id}`);
      } catch (err) {
        console.error('[UPDATE] Falha ao criar cargo update-ping:', err);
      }
    }

    // Botão de Ping Me
    const pingRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`get_role:${pingRole?.id}`)
        .setLabel('🔔 Ping Me')
        .setStyle(ButtonStyle.Secondary),
    );

    const channel = interaction.client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
      // Menciona os que já têm o cargo + envia embed com botão
      const mention = pingRole ? `<@&${pingRole.id}>` : '';
      await channel.send({
        content: mention || undefined,
        embeds: [embed],
        components: [pingRow],
        allowedMentions: { roles: pingRole ? [pingRole.id] : [] },
      });
    }

    await interaction.editReply({
      content: `✅ Script **${script.name}** atualizado para v${newVersion}!`,
    });
  },
};