const { RichEmbed } = require("discord.js")

module.exports = {
    name: "avatar",
    alias: ["a"],
    description: "Responds with the avatar URL of the specified user.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let member = msg.mentions.members.first() || (args[0] ? msg.guild.members.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) : msg.member);

        if (!member) return msg.reply("sorry that is an invalid user.");

        let avatarEmbed = new RichEmbed()
            .setAuthor(msg.author.username,msg.author.avatarURL)
            .setImage(member.user.avatarURL)
            .setDescription(`Here is ${member.user.username}'s profile picture.`)
            .setColor("RANDOM");

        msg.channel.send(avatarEmbed);    

    }
}