const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joincall')
    .setDescription('Bot entra na sua call e fica lá'),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: '❌ Você precisa estar em uma call.', flags: MessageFlags.Ephemeral });
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: true,
    });

    connection.on(VoiceConnectionStatus.Ready, () => console.log(`[VOICE] Conectado em: ${voiceChannel.name}`));
    connection.on(VoiceConnectionStatus.Disconnected, () => console.log('[VOICE] Desconectado.'));

    await interaction.reply({ content: `✅ Entrei em **${voiceChannel.name}**.`, flags: MessageFlags.Ephemeral });
  }
};
