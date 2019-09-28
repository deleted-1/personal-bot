const { RichEmbed } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    run: async (client, member) => {

        const {guild, user, joinedTimestamp} = member;
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

            if (joinedTimestamp-user.createdAt < Number("8.64e+7"))
                setTimeout(async () => {
                    await member.addRole("627316248400625687")}
                ,Number("8.64e+7"));
            else
                await member.addRole("627316248400625687");
        }

    }
}