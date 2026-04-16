const config = require('../config/ticketConfig.json');

async function createTicketChannel(guild, user) {
  const name = config.channelNameFormat.replace('{username}', user.username.toLowerCase());
  
  const supportRole = guild.roles.cache.get(config.supportRoleId) ||
    await guild.roles.fetch(config.supportRoleId);
    
  return guild.channels.create({
    name,
    type: 0, // text channel
    permissionOverwrites: [
      { id: guild.roles.everyone, deny: ['ViewChannel'] },
      { id: user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
      { id: supportRole, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'] }
    ]
  });
}

module.exports = { createTicketChannel };
