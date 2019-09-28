const { prefix } = require('../config.json');

module.exports = async (client, msg) => {

    const msgArray = msg.content.split(" ");
    const args = msgArray.slice(1);
    const cmd = client.commands.get(msgArray[0].slice(1)) || client.commands.find(c => c.alias.includes(msgArray[0].slice(1)));


    if (!msg.guild || msg.author.bot) return;

    /*const user = ['placeholder'].get(`${msg.guild.id}-${msg.author.id}`);
    if (!user.lastMessage) {

        user.lastMessage = true;
        setTimeout(() => {
            user.lastMessage = false;
        },1000*30);
        user.xp(1000);

    }*/

    if (!cmd || !msg.content.startsWith(prefix)) return;
    if (!msg.member.permissions.has(cmd.permission)) return;

    cmd.run(client,msg,args);

}