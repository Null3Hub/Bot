// utils/whitelist.js
// Whitelist centralizada — lê do .env

// Formato da variável: WHITELIST=id1,id2,id3
function isAllowed(userId) {
  const raw = process.env.WHITELIST || '';
  const ids = raw.split(',').map(id => id.trim()).filter(Boolean);
  return ids.includes(userId);
}

function checkWhitelist(interaction) {
  if (!isAllowed(interaction.user.id)) {
    interaction.reply({
      content: '❌ Você não tem permissão para usar este bot.',
      ephemeral: true
    });
    return false;
  }
  return true;
}

module.exports = { isAllowed, checkWhitelist };
