const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const config = require("./config.json");

const { play } = require("./include/play");
const {YOUTUBE_API_KEY} = require("./config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

client.queue = new Map();
client.past = new Map();


client.config = config;
client.points = new Enmap({name: "points"});
client.settings = new Enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});
client.confess = new Enmap({name: "confess"})
client.logger = new Enmap({name: "logger"})

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Tentative de chargement de la commande ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.login(config.token);
