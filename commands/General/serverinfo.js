const { RichEmbed } = require('discord.js');

module.exports = {
    name: "serverinfo",
    alias: ["info"],
    description: "Brings up information of the server.",
    permission: "VIEW_CHANNEL",
    run: async ({user, users}, {guild, channel, author}, args) => {

        try {

            const embed = new RichEmbed()
                .addField("Server ID",guild.id,true)
                .addField("Owner",guild.owner.user.tag,true)
                .addField("Created At",guild.createdAt,true)
                .addField("Text Channels",guild.channels.filter(ch => ch.type == "text").size,true)
                .addField("Voice Channels",guild.channels.filter(ch => ch.type == "voice").size,true)
                .addField("Members",guild.members.size,true)
                .addField("Bots",guild.members.filter(m => m.user.bot ).size,true)
                .addField("Roles",guild.roles.size-1,true)
                .addField("Region",guild.region,true)
                .addField(`Custom Emotes [${guild.emojis.size}]`, guild.emojis.size ? guild.emojis.map((e)=> e.name).join(" ") : 'No Emotes',true)
                .setTimestamp()
                .setTitle(`Server Info of ${guild.name}`)
                .setAuthor(user.username,user.avatarURL)
                .setColor("PURPLE")
                .setFooter(author.username,author.avatarURL);

            channel.send(embed);

        } catch (err) {

            users.get("316671807052578827").send(err.message);

        }

        

    }
}