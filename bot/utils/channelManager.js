const config = require('../config/ticketConfig.json');

async function createTicketChannel(guild, user) {
  const category = guild.channels.cache.find(c => c.name === config.categoryName) ||
    await guild.channels.create({ name: config.categoryName, type: 4 }); // type 4 = categoria

  const name = config.channelNameFormat.replace('{username}', user.username.toLowerCase());

  // Busca o cargo de suporte no cache ou faz fetch
  const supportRole = guild.roles.cache.get(config.supportRoleId) ||
    await guild.roles.fetch(config.supportRoleId);

  return guild.channels.create({
    name,
    type: 0,
    parent: category,
    permissionOverwrites: [
      { id: guild.roles.everyone, deny: ['ViewChannel'] },
      { id: user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
      { id: supportRole, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'] }
    ]
  });
}

module.exports = { createTicketChannel };