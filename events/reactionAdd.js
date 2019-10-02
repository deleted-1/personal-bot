const { RichEmbed } = require('discord.js');

module.exports = {
    name: "messageReactionAdd",
    run: async (client, msgReaction, user) => {

        const {guild, channel, content, author, url, attachments, id,reactions} = msgReaction.message;
        if (guild.id == "623752428289785856" && reactions.filter(r=>r.emoji.name=="🌟" || r.emoji.name=="⭐").length >= 3 ) {
            const embed = new RichEmbed()
                .setThumbnail(author.avatarURL)
                .addField("Author",author,true)
                .addField("Channel",channel,true)
                .addField("Message",content,false)
                .addField("Message",`[Jump to](${url})`,false)
                .setImage(attachments.first().url)
                .setThumbnail(author.avatarURL || avatar.defaultAvatarURL)
                .setColor("GOLD")
                .setTimestamp(`🌟 ${reactions.filter(r=>r.emoji.name=="🌟" || r.emoji.name=="⭐").length} | ${id}`)
                .setTimestamp();
            
            try{
                let message = client.channels.get("624776427102797834").messages.find(m => m.embeds.first().footer.includes(id));
                await message.edit(embed);
            } catch (e) {
                await client.channels.get("624776427102797834").send(embed); 
            }            

        }

    }
}