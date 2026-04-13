const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const EMOJI_REGEX = /<a?:([a-zA-Z0-9_]+):(\d+)>/g;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edd')
    .setDescription('Bulk add custom emojis from another server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers)
    .addStringOption(o =>
      o.setName('emojis')
       .setDescription('Paste custom emojis e.g. <:skull:123> <:fire:456>')
       .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const input = interaction.options.getString('emojis');
    const matches = [...input.matchAll(EMOJI_REGEX)];

    if (matches.length === 0) {
      return interaction.editReply('❌ No custom emojis found. Make sure to paste them in `<:name:ID>` format.');
    }

    const results = { success: [], failed: [] };

    for (const match of matches) {
      const animated = match[0].startsWith('<a:');
      const name = match[1];
      const id = match[2];
      const ext = animated ? 'gif' : 'png';
      const url = `https://cdn.discordapp.com/emojis/${id}.${ext}`;

      try {
        const emoji = await interaction.guild.emojis.create({ attachment: url, name });
        results.success.push(`<:${emoji.name}:${emoji.id}> \`${emoji.name}\``);
      } catch (err) {
        const reason = err.message?.includes('Maximum') ? 'server emoji limit reached' : err.message;
        results.failed.push(`\`${name}\` — ${reason}`);
      }
    }

    const lines = [];
    if (results.success.length > 0) {
      lines.push(`✅ **Added (${results.success.length})**`);
      lines.push(results.success.join('\n'));
    }
    if (results.failed.length > 0) {
      lines.push(`\n❌ **Failed (${results.failed.length})**`);
      lines.push(results.failed.join('\n'));
    }

    let reply = lines.join('\n');
    if (reply.length > 1900) reply = reply.slice(0, 1900) + '\n...and more (message too long)';

    await interaction.editReply(reply);
  }
};
