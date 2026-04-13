const { SlashCommandBuilder } = require('discord.js');
const { commitScript } = require('../../services/github');
const { buildAddScriptEmbed } = require('../../services/embedBuilder');
const { getGameInfo } = require('../../services/roblox');
const Script = require('../../models/Script');

const ALLOWED_EXTENSIONS = ['.lua', '.txt'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addscript')
    .setDescription('Adiciona um novo script ao sistema')
    .addStringOption(o => o.setName('placeid').setDescription('PlaceId ou link').setRequired(true))
    .addAttachmentOption(o => o.setName('file').setDescription('Arquivo .lua ou .txt').setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('Nome (opcional)').setRequired(false))
    .addStringOption(o => o.setName('image').setDescription('Thumbnail (opcional)').setRequired(false))
    .addStringOption(o => o.setName('features').setDescription('Features (vírgula)').setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const placeInput  = interaction.options.getString('placeid');
    const file        = interaction.options.getAttachment('file');
    const nameInput   = interaction.options.getString('name');
    const imageInput  = interaction.options.getString('image');
    const featuresRaw = interaction.options.getString('features');

    const placeId = placeInput.match(/\d+/)?.[0];
    if (!placeId) return interaction.editReply('❌ PlaceId inválido.');

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) return interaction.editReply('❌ Arquivo inválido (.lua/.txt).');

    // Download do arquivo
    let scriptContent;
    try {
      scriptContent = await fetch(file.url).then(r => r.text());
    } catch (err) {
      return interaction.editReply('❌ Falha ao baixar o arquivo.');
    }

    if (!scriptContent?.trim()) return interaction.editReply('❌ Arquivo vazio.');

    // Roblox API é opcional
    let gameInfo = { name: null, thumb: null };
    try {
      gameInfo = await getGameInfo(placeId, placeInput);
    } catch (err) {
      console.warn('[ROBLOX] Falha ao buscar info do jogo, continuando sem ela.');
    }

    const name = nameInput || gameInfo.name || `Script ${placeId}`;
    const image = imageInput || gameInfo.thumb || null;
    const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

    // Commit no GitHub com nome: nomedojogo(placeid).lua
    let githubResult;
    try {
      githubResult = await commitScript({
        placeId,
        content: scriptContent,
        gameName: name
      });
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Falha ao enviar para o GitHub.');
    }

    // Salva no MongoDB
    const scriptId = `${placeId}_${Date.now()}`;
    const script = new Script({
      name,
      id: scriptId,
      placeId,
      rawUrl: githubResult.rawUrl,
      fileName: githubResult.fileName,
      image,
      features,
      status: 'active',
      version: 1,
      logs: [{ type: 'created', description: 'Script adicionado', by: interaction.user.id, version: 1 }]
    });

    await script.save();

    // Envia embed no canal
    const channel = interaction.client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    const embed = buildAddScriptEmbed({ name, scriptId, placeId, image, features, version: 1, rawUrl: githubResult.rawUrl, user: interaction.user });

    if (channel) await channel.send({ embeds: [embed] });
    await interaction.editReply({ content: `✅ Script **${name}** adicionado! ID: \`${scriptId}\`` });
  }
};
