const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  AttachmentBuilder
} = require('discord.js');

const MAX_FIELD_LENGTH = 1000;

// cache global
const emojiCache = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('elist')
    .setDescription('Lista emojis com sistema avançado')
    .addStringOption(option =>
      option.setName('busca')
        .setDescription('Buscar emoji pelo nome')
        .setAutocomplete(true)
    ),

  // =========================
  // 🧠 AUTOCOMPLETE
  // =========================
  async autocomplete(interaction) {
    const focused = interaction.options.getFocused().toLowerCase();

    const emojis = interaction.guild.emojis.cache;

    const filtered = emojis
      .filter(e => e.name.toLowerCase().includes(focused))
      .first(25);

    await interaction.respond(
      filtered.map(e => ({
        name: e.name,
        value: e.name
      }))
    );
  },

  // =========================
  // 🚀 EXECUTE
  // =========================
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guild.id;
    const query = interaction.options.getString('busca');

    // =========================
    // ⚡ CACHE
    // =========================
    let data = emojiCache.get(guildId);

    if (!data) {
      const emojis = interaction.guild.emojis.cache;

      const formatEmoji = (e) => {
        const tag = e.animated
          ? `<a:${e.name}:${e.id}>`
          : `<:${e.name}:${e.id}>`;

        return `${tag} — \`${tag}\``;
      };

      const staticEmojis = emojis.filter(e => !e.animated);
      const animatedEmojis = emojis.filter(e => e.animated);

      data = {
        raw: emojis.map(e => e),
        all: emojis.map(formatEmoji),
        static: staticEmojis.map(formatEmoji),
        animated: animatedEmojis.map(formatEmoji),
      };

      emojiCache.set(guildId, data);

      // expira em 5 min
      setTimeout(() => emojiCache.delete(guildId), 300000);
    }

    // =========================
    // 🔎 FILTRO
    // =========================
    let currentCategory = 'all';

    const filterList = (list) => {
      if (!query) return list;
      return list.filter(e =>
        e.toLowerCase().includes(query.toLowerCase())
      );
    };

    // =========================
    // 📄 PAGINAÇÃO
    // =========================
    const splitPages = (lines) => {
      const pages = [];
      let current = '';

      for (const line of lines) {
        const next = current ? current + '\n' + line : line;

        if (next.length > MAX_FIELD_LENGTH) {
          pages.push(current);
          current = line;
        } else {
          current = next;
        }
      }

      if (current) pages.push(current);
      return pages;
    };

    let page = 0;

    const getPages = () => splitPages(filterList(data[currentCategory]));

    // =========================
    // 📦 EMBED
    // =========================
    const getEmbed = () => {
      const list = filterList(data[currentCategory]);
      const pages = getPages();

      return new EmbedBuilder()
        .setTitle('📋 Emojis do Servidor')
        .setColor(0x000000)
        .setDescription(pages[page] || '❌ Nenhum resultado')
        .setFooter({
          text: `Página ${page + 1}/${pages.length || 1} • Total: ${list.length} • 🖼️ ${data.static.length} • 🎞️ ${data.animated.length}`
        });
    };

    // =========================
    // 🎛️ COMPONENTES
    // =========================
    const getComponents = () => {
      const pages = getPages();

      return [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('⬅️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === 0),

          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('➡️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page >= pages.length - 1),

          new ButtonBuilder()
            .setCustomId('copy')
            .setLabel('📋 Copiar')
            .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
            .setCustomId('json')
            .setLabel('🧾 JSON')
            .setStyle(ButtonStyle.Success)
        ),

        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('category')
            .setPlaceholder('Selecionar categoria')
            .addOptions([
              { label: 'Todos', value: 'all' },
              { label: 'Estáticos', value: 'static' },
              { label: 'Animados', value: 'animated' },
            ])
        )
      ];
    };

    const msg = await interaction.editReply({
      embeds: [getEmbed()],
      components: getComponents()
    });

    // =========================
    // 🎮 INTERAÇÕES
    // =========================
    const collector = msg.createMessageComponentCollector({
      time: 120000
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: '❌ Você não pode usar isso.',
          ephemeral: true
        });
      }

      if (i.isButton()) {

        if (i.customId === 'prev') page--;
        if (i.customId === 'next') page++;

        if (i.customId === 'copy') {
          const list = filterList(data[currentCategory]).join('\n');

          return i.reply({
            content: `📋 Emojis:\n\n${list.slice(0, 1900)}`,
            ephemeral: true
          });
        }

        if (i.customId === 'json') {
          const raw = data.raw.map(e => ({
            name: e.name,
            id: e.id,
            animated: e.animated,
            url: e.url
          }));

          const buffer = Buffer.from(JSON.stringify(raw, null, 2));

          const file = new AttachmentBuilder(buffer, {
            name: 'emojis.json'
          });

          return i.reply({
            files: [file],
            ephemeral: true
          });
        }
      }

      if (i.isStringSelectMenu()) {
        currentCategory = i.values[0];
        page = 0;
      }

      await i.update({
        embeds: [getEmbed()],
        components: getComponents()
      });
    });

    collector.on('end', async () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },

  emojiCache
};
