const { RichEmbed } = require("discord.js");
const { prefix } = require("../../config.json");

module.exports = {
    name: "suggestion",
    alias: ["suggest","su"],
    description: "Creates a suggestion embed.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        if (msg.channel.id !== "623758207508152320") return;

        const embed = new RichEmbed()
            .setTitle("Suggestion")
            .setAuthor(msg.author.tag,msg.author.avatarURL)
            .setThumbnail(msg.author.avatarURL)
            .setDescription(args.join(" "))
            .setColor("BLUE")
            .setFooter(`"${prefix}suggest <message>" to write a suggestion.`,client.user.avatarURL)
            .setTimestamp();

        if (!msg.deleted) await msg.delete();
        msg.channel.send(embed)
            .then(async m => {
                await m.react("✅");
                await m.react("❌");
            });    

    }
}