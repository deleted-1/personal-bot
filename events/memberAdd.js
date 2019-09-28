const { RichEmbed } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    run: async (client, {guild, user}) => {

        if (guild.id == "623752428289785856") {
            const embed = new RichEmbed()
                .setAuthor(user.username, user.avatarURL)
                .setTitle("Member Join")
                .setThumbnail(user.avatarURL)
                .addField("ID",user.id,true)
                .addField("Status",user.presence.status,true)
                .addField("Account Created",user.createdAt)
                .setTimestamp();
            
            await client.channels.get("624776867722821642").send(embed);
        }

    }
}