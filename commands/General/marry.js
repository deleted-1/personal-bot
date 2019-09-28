const SQLite = require('better-sqlite3');
const profiles =  new SQLite('./profiles.db');

const { RichEmbed } = require('discord.js');

module.exports = {
    name: "marry",
    alias: ["m"],
    description: "Marry a member of your choosing :smirk:",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        if (!msg.mentions.users) return msg.reply('you have to mention the person you would like to maryr')
       
        let user = profiles.prepare("SELECT * FROM profiles WHERE userid = ? AND guildid = ?").get(msg.author.id, msg.guild.id);
        let pSpouse = profiles.prepare("SELECT * FROM profiles WHERE userid = ? AND guildid = ?").get(msg.mentions.users.first().id, msg.guild.id);

        if (!pSpouse)
            return msg.reply('could not find that user. Make sure you are tagging the user you would like to marry.');

        if (pSpouse.spouse)
            return msg.reply('sorry to break it to you .. but they are already married :sad:');
        else if (user.spouse)
            return msg.reply('you are already married. || slut ||');
        
        const filter = m => m.author = msg.mentions.users.first();
        let embed = new RichEmbed()
            .setAuthor(msg.author.username,msg.author.avatarURL)
            .setColor("RANDOM")
            .setDescription(`Do you accept ${msg.author}'s marriage proposal?`)
            .setImage('https://cdn.discordapp.com/attachments/611189424692133898/612077209011748906/BIVS0031R08_YAA18DIG6XXXXXXXX_ABCD00-PICS-00001-1024-16501.png')
            .setFooter('Say yup/yes/ofcourse/y to accept',client.user.avatarURL)
            .setTimestamp();

        await msg.channel.send(embed);
        await msg.channel.awaitMessages(filter,{max:1,time:30000})
            .then(async responses => {
                
                let answer = responses.first();
                if (['yup','yes','ofcourse','y'].includes(answer.content.toLowerCase())){
                    await msg.reply('Congratulations you two are now happily married.');
                    pSpouse.spouse = msg.author.id;
                    user.spouse = pSpouse.userid;

                    profiles.prepare("UPDATE profiles SET spouse = ? WHERE userid = ? AND guildid = ?").run(pSpouse.spouse,pSpouse.userid,pSpouse.guildid);
                    profiles.prepare("UPDATE profiles SET spouse = ? WHERE userid = ? AND guildid = ?").run(user.spouse,user.userid,user.guildid);
                }  else {
                    throw 'Error'
                }              

            })
            .catch(err => {
                if (err) {
                    console.log(err)
                    msg.reply('dw bro. hoes aint shit anyways.')
                }
            });
        

    }
}