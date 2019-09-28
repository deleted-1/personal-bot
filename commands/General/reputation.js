const SQLite = require('better-sqlite3');

module.exports = {
    name: "reputation",
    alias: ["rep"],
    description: "Give someone a reputation point.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        const profiles = new SQLite('./profiles.db');
        const { guild, channel, author, mentions } = msg;

        if (!mentions.members.first()) return channel.send("You have to mention the person you would like to give the reputation point to");
        else if (mentions.members.first().id == author.id) return channel.send("You cannot give a reputation point to yourself.");
        

        const user = profiles.prepare("SELECT * FROM profiles WHERE userid = ? AND guildid = ?").get(author.id,guild.id);
        const receiver = profiles.prepare("SELECT * FROM profiles WHERE userid = ? AND guildid = ?").get(mentions.members.first().id,guild.id);

        if (msg.createdTimestamp - user.lastRep < Number('8.64e+7')) {
            return channel.send('You have to wait a day before using the ``rep`` command again.');
        }

        profiles.prepare("UPDATE profiles SET rep = rep + ? WHERE userid = ? AND guildid = ?").run(1,receiver.userid,receiver.guildid);
        profiles.prepare("UPDATE profiles SET lastRep = ? WHERE userid = ? AND guildid = ?").run(msg.createdTimestamp,user.userid,user.guildid);
        channel.send(`${author} has given ${mentions.users.first()} a reputation point.`);
                
    }
}