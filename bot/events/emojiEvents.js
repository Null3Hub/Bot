module.exports = (client, emojiCache) => {

  client.on('emojiCreate', (emoji) => {
    emojiCache.delete(emoji.guild.id);
  });

  client.on('emojiDelete', (emoji) => {
    emojiCache.delete(emoji.guild.id);
  });

  client.on('emojiUpdate', (oldEmoji, newEmoji) => {
    emojiCache.delete(newEmoji.guild.id);
  });

};
