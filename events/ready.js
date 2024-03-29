const SQLite = require('better-sqlite3');

module.exports = {
    name: "ready",
    run: async (client) => {

        console.log(`Name: ${client.user.username}`);
        console.log(`ID: ${client.user.id}`);

        const warns =  new SQLite('./warns.db');
        const profiles = new SQLite('./profiles.db');

        const warnTable = warns.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'warns'").get();
        const profileTable = profiles.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'profiles'").get()

        if (!warnTable['count(*)'])
            warns.prepare("CREATE TABLE warns (guild TEXT, user TEXT, reason TEXT, moderator TEXT);").run();

        if (!profileTable['count(*)'])
            profiles.prepare("CREATE TABLE profiles (userid TEXT, guildid TEXT, spouse TEXT, cash INTEGER, rep INTEGER, xp INTEGER, daily INTEGER, lastRep INTEGER)").run();

        client.guilds.forEach(guild => {
            if (guild.id !== "623752428289785856" && guild.id !== "573988137651404810") guild.leave();
            else{
                guild.members.forEach(member => {

                    let m = profiles.prepare("SELECT * FROM profiles WHERE userid = ? AND guildid = ?").get(member.id,guild.id);
                    if (!m)
                        profiles.prepare("INSERT INTO profiles VALUES(@userid, @guildid, @spouse, @cash, @rep, @xp, @daily, @lastRep)").run({
                            userid:member.id,
                            guildid:guild.id,
                            spouse:'',
                            cash:0,
                            rep:0,
                            xp:0,
                            daily:0,
                            lastRep:0
                        });
                    
                });
            }
        });
    }
}