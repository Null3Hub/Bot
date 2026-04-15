// services/store/auditService.js
const AuditService = {
  log(client, action, data) {
    // Usa o canal de logs ou o da lista como fallback
    const channelId = process.env.DISCORD_CHANNEL_ID || process.env.LIST_CHANNEL_ID;
    if (!channelId || !client) return;
    
    const channel = client.channels.cache.get(channelId);
    if (!channel) return;

    const embed = {
      title: `🛒 Store Audit Log`,
      description: `**Action:** \`${action}\`\n**User:** ${data.admin || 'Unknown'}\n**Details:** \`${JSON.stringify(data).slice(0, 1000)}\``,
      color: 0x5865f2,
      timestamp: new Date().toISOString()
    };
    
    channel.send({ embeds: [embed] }).catch(console.error);
  }
};

module.exports = AuditService;
