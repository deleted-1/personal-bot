const { RichEmbed } = require('discord.js');

module.exports = {
    name: "messageDelete",
    run: async (client, message) => {

        const {guild, author, content} = message;
        if (guild.id == "623752428289785856") {
            const embed = new RichEmbed()
                .setAuthor(author.tag, author.avatarURL)
                .setTitle("Message Delete")
                .setThumbnail(author.avatarURL)
                .addField("ID",author.id,true)
                .addField("Status",author.presence.status,true)
                .addField("Message",content)
                .setColor("RED")
                .setTimestamp();
            
            await client.channels.get("623758761894346752").send(embed); 

        }

    }
}