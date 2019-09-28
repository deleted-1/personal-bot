const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client();
const Handlers = ['event','command'];

client.commands = new Collection();
client.queue = new Collection();
client.dispatchers = new Collection();

client.login(token);
Handlers.forEach(handler => require(`./util/${handler}Handler.js`)(client));





