const { RichEmbed, Util } = require('discord.js');

module.exports = {
    name: "enlarge",
    alias: ["large"],
    description: "Enlarges an emoji. Self explanatory.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let emoji = Util.parseEmoji(args[0]) || {};
        let ext = emoji.animated ? '.gif' : '.png';
        
        if (!emoji.id) 
            return msg.reply('sorry not a valid emoji. (Unicode emoji counts as invalid as well.)');
        
        let embed = new RichEmbed().setImage('https://cdn.discordapp.com/emojis/'+emoji.id+ext)
        msg.channel.send(embed)
        


    }
}