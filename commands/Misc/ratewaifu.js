const { RichEmbed } = require('discord.js');

module.exports = {

    name: "ratewaifu",
    alias: ["rwaifu"],
    description: "Rate your waifu :eyes:",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let user = msg.mentions.users.first() || msg.author;

        let rate = Math.floor(Math.random()*101);
    
        if ('316671807052578827' == user.id) rate = 100;
        let emoji;

        if (rate == 100) emoji = '💯';
        else if (rate >= 90) emoji = '😄'
        else if (rate >= 61) emoji = '🙂';
        else if (rate >= 50) emoji = '😐';
        else if (rate >= 10) emoji = '☹';
        else if (rate != 0) emoji = '🙁'
        else emoji = "😰"

        let embed = new RichEmbed()
            .setColor('RANDOM')
            .setAuthor(user.username,user.avatarURL)
            .setTitle('Are you fit to be my waifu?')
            .setDescription(`You are a ${rate}/100 ${emoji}`);

        msg.channel.send(embed)

    }
}