const { RichEmbed } = require('discord.js');
const { readdir } = require('fs');

let commands = {};

readdir('./commands',async (err, dir) => {
    if (err) return console.log(err);

    dir.forEach(d => {
        readdir(`./commands/${d}`,async (err,files) => {

            if (err) return console.log(err);

            commands[d] = files.map(f => f.substring(0, f.length - 3));

        });
    });
});



module.exports = {
    name: "help",
    alias: ["h"],
    description: "Gives you all the commands",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {



        let embed = new RichEmbed()
            .setTitle('Help Command')
            .setAuthor(client.user.username,client.user.avatarURL)
            .setColor("#4287f5")
            .setFooter('Do ``>help <command>`` to see information on a specific command.')
            .setTimestamp();

        for (const module of Object.keys(commands)) {

            let value = commands[module].join("\n");

            embed.addField(module, value, true);
        }
        
        await msg.author.send(embed);
        await msg.reply('sent you a DM!');

    }
}