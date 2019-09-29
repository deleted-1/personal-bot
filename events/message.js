const { prefix } = require('../config.json');

module.exports = {
    name: "message",
    run: async (client, msg) => {

    const msgArray = msg.content.split(" ");
    const args = msgArray.slice(1);
    const cmd = client.commands.get(msgArray[0].slice(prefix.length)) || client.commands.find(c => c.alias.includes(msgArray[0].slice(prefix.length)));

    if (!msg.guild || msg.author.bot) return;
    if (msg.channel.id == "623758207508152320" && !msg.member.permissions.has("ADMINISTRATOR")) msg.delete();
    if (!cmd || !msg.content.startsWith(prefix)) return;
    if (!msg.member.permissions.has(cmd.permission)) return;

    cmd.run(client,msg,args);
    }
}