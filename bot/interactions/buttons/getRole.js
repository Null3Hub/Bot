const { MessageFlags } = require('discord.js');

module.exports = {
  // customId dinâmico: get_role:<roleId>
  // Registrado no index.js via prefix matching
  async execute(interaction) {
    const roleId = interaction.customId.split(':')[1];
    if (!roleId)
      return interaction.reply({
        content: '❌ Configuração inválida.',
        flags: MessageFlags.Ephemeral,
      });

    const role = interaction.guild.roles.cache.get(roleId);
    if (!role)
      return interaction.reply({
        content: '❌ Cargo não encontrado. Contate um administrador.',
        flags: MessageFlags.Ephemeral,
      });

    const member = interaction.member;

    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(role);
        return interaction.reply({
          content: `✅ Cargo **${role.name}** removido.`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await member.roles.add(role);
        return interaction.reply({
          content: `✅ Cargo **${role.name}** adicionado!`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (err) {
      console.error('[getRole]', err);
      return interaction.reply({
        content: '❌ Sem permissão para gerenciar este cargo.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};