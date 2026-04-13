const { SlashCommandBuilder } = require('discord.js');
const { commitScript } = require('../../services/github');
const { buildAddScriptEmbed } = require('../../services/embedBuilder');
const { getGameInfo } = require('../../services/roblox'); // Mantenha seu arquivo atual
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
    await interaction.deferReply();
    
    // 1. Inputs
    const placeInput  = interaction.options.getString('placeid');
    const file        = interaction.options.getAttachment('file');
    const nameInput   = interaction.options.getString('name');
    const imageInput  = interaction.options.getString('image');
    const featuresRaw = interaction.options.getString('features');

    // 2. Validações
    const placeId = placeInput.match(/\d+/)?.[0]; // Extrai números
    if (!placeId) return interaction.editReply('❌ PlaceId inválido.');

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) return interaction.editReply('❌ Arquivo inválido (.lua/.txt).');

    // 3. Downloads Paralelos
    let scriptContent, gameInfo = { name: null, thumb: null };
    try {
      [scriptContent, gameInfo] = await Promise.all([
        fetch(file.url).then(r => r.text()),
        getGameInfo(placeId, placeInput)
      ]);
    } catch (err) {
      return interaction.editReply('❌ Falha ao baixar arquivo ou info do jogo.');
    }

    if (!scriptContent?.trim()) return interaction.editReply('❌ Arquivo vazio.');

    const name = nameInput || gameInfo.name || `Script ${placeId}`;
    const image = imageInput || gameInfo.thumb || null;
    const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

    // 4. Commit no GitHub (Repo Separado)
    let githubResult;
    try {
      // O serviço github.js salva como {placeId}.lua
      githubResult = await commitScript({
        placeId,
        content: scriptContent
      });
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Falha ao enviar para o GitHub.');
    }

    // 5. Salva Metadata no Mongo
    const scriptId = `${placeId}_${Date.now()}`;
    const script = new Script({
      name,
      id: scriptId,
      placeId,
      rawUrl: githubResult.rawUrl,   // Salva o link do GitHub externo
      fileName: githubResult.fileName,
      image,
      features,
      status: 'active',
      version: 1,
      logs: [{ type: 'created', description: 'Script adicionado', by: interaction.user.id, version: 1 }]
    });

    await script.save();

    // 6. Resposta
    const channel = interaction.client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    const embed = buildAddScriptEmbed({ name, scriptId, placeId, image, features, version: 1, rawUrl: githubResult.rawUrl, user: interaction.user });
    
    if (channel) await channel.send({ embeds: [embed] });
    await interaction.editReply({ embeds: [embed] });
  }
};
