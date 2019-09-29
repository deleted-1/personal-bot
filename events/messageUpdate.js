const { RichEmbed } = require('discord.js');

module.exports = {
    name: "messageUpdate",
    run: async (client, oldMessage, newMessage) => {

        const {guild, author, content:oldContent} = oldMessage;
        const {content:newContent, url} = newMessage;
        if (guild.id == "623752428289785856") {
            const embed = new RichEmbed()
                .setAuthor(author.tag, author.avatarURL)
                .setTitle("Message Delete")
                .setThumbnail(author.avatarURL)
                .addField("ID",author.id,true)
                .addField("Status",author.presence.status,true)
                .addField("Original Message",oldContent)
                .addField("Current Message",newContent)
                .addField("Message",`[Jump](${url})`)
                .setColor("LIGHT_GREY")
                .setTimestamp();
            
            await client.channels.get("623758761894346752").send(embed); 

        }

    }
}