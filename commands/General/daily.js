const SQLite = require('better-sqlite3');

module.exports = {
    name: "daily",
    alias: ["d"],
    description: "Free coins.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        const profiles = new SQLite('./profiles.db');

        const { guild, channel, author } = msg;
        const user = profiles.prepare("SELECT * FROM profiles WHERE userid = ? AND guildid = ?").get(author.id,guild.id);

        if (msg.createdTimestamp - user.daily < Number('8.64e+7')) {
            return channel.send('You have to wait a day before using the ``daily`` command.');
        }

        profiles.prepare("UPDATE profiles SET daily = ?, cash = cash + ? WHERE userid = ? AND guildid = ?").run(msg.createdTimestamp,100,author.id, guild.id);
        msg.react('👍');
        channel.send('Come again tomorrow!!');
        
        
    }
}