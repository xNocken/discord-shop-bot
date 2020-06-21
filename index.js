const Discord = require('discord-module');
const token = require('./token');
const Client = require('fortnite');
const fortnite = new Client(token.fortnite);

const options = {
  token: token.discord,
};

const discord = new Discord(options);

const getStatsEmbed = (stats, name, url) => ({
  author: {
    name: `${name}`,
    url: `${encodeURI(url)}`,
  },
  description: ((stats) => {
    let statsText = '';
    Object.entries(stats).forEach((stat) => {
      statsText += `${stat[0]}: ${stat[1]}\n`
    });
    return statsText;
  })(stats),
  title: `${name}'s Stats`,
  color: 0x0091ff,
});

discord.onmessage = (message, reply) => {
  if (!message.content.startsWith('#')) {
    return;
  }

  const args = message.content.split(' ').splice(1, 1000);

  if (message.content === '#shop') {
    fortnite.store().then((shop) => {
      let items = '';
      shop.forEach((item) => {
        items += item.name + '\n';
      });
      reply(items);
    });
  }

  if (message.content === '#shop price') {
    fortnite.store().then((shop) => {
      let items = 0;
      shop.forEach((item) => {
        items += item.vbucks;
      });

      reply(items + ' VBucks');
    });
  }

  if (message.content.startsWith('#stats')) {
    fortnite.user(args.splice(2, 1000).join(' '), args[0]).then((stats) => {
      
      console.log(stats)
      console.log(getStatsEmbed(stats.stats[args[1]], stats.username, stats.url));
      reply(getStatsEmbed(stats.stats[args[1]], stats.username, stats.url));
    });
  }
};
