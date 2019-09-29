const { RichEmbed } = require('discord.js');

module.exports = {
    name: "guildMemberRemove",
    run: async (client, member) => {

        const {guild, user} = member;
        if (guild.id == "623752428289785856") {
            const embed = new RichEmbed()
                .setAuthor(user.username, user.avatarURL)
                .setTitle("Member Leave")
                .setThumbnail(user.avatarURL)
                .addField("ID",user.id,true)
                .addField("Status",user.presence.status,true)
                .addField("Account Created",user.createdAt)
                .setColor("RED")
                .setTimestamp();
            
            await client.channels.get("624776867722821642").send(embed);

        }

    }
}