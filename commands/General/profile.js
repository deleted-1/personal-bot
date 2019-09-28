const { RichEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');

module.exports = {
    name: "profile",
    alias: [""],
    description: "See your profile or another user's profile.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        const { mentions, channel, guild } = msg;
        if (!mentions.members.first()) return channel.send("You have to mention somebody");
        const profiles = new SQLite('./profiles.db');
        let m = profiles.prepare("SELECT * FROM profiles WHERE userid = ? AND guildid = ?").get(mentions.members.first().id,guild.id);

        if (!m) return channel.send('Could not find that user.');

        const user = await client.fetchUser(m.spouse);

        const embed = new RichEmbed()
            .setAuthor(client.users.get(mentions.members.first().id).username,client.users.get(mentions.members.first().id).avatarURL)
            .setTitle('Profile')
            .setColor('RANDOM')
            .addField('Currency', m.cash, true)
            .addField('Experience', m.xp, true)
            .addField('Reputation', m.rep, false)
            .addField('Spouse', m.spouse ? user.tag : "None")
            .setTimestamp()
            .setFooter(client.user.username, client.user.avatarURL);

        channel.send(embed);


        

    }
}