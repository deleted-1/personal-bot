const { RichEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const database = new SQLite('./warns.db');


module.exports = {
    name: "warn",
    alias: ["warn"],
    description: "Give a user a warning.",
    permission: "MANAGE_ROLES",
    run: async (client, msg, args) => {

        let member = msg.mentions.members.first();
        let mod = msg.member;
        let reason =  args.slice(1).join(" ");

        if (member == mod) return msg.reply('lol');

        if (!member){

            const filter = m => m.author == msg.author && parseInt(m.content) < 6 && parseInt(m.content) > 0
            let members = msg.guild.members.filter(m => m.user.username.toLowerCase().includes(args[0].toLowerCase()));
            if(!members.size) return msg.reply('please specify a valid server member.');

            members = members.map(m => m.user.tag);

            let description = '';
            for(let i = 0; i<5; ++i){
                if(!members[i]) break;
                description += `\`${i+1}.\` `+members[i];
            }
            
            let membersEmbed = new RichEmbed()
                .setDescription(description)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter('Type a number 1-5 to select a user.',client.user.avatarURL)

            await msg.channel.send(membersEmbed);
            await msg.channel.awaitMessages(filter,{max:1,time:10000}).then(async response => {
                member = await msg.guild.members.find(m => m.user.tag == members[parseInt(response.first())-1])
            }).catch(async err => {
                if (err){ 
                    await msg.reply('timed out. cancelling command.');
                    throw 'Timed Out';
                }
            });

        }
        
        await msg.reply('You successfully warned '+member);
        await member.send(`You were warned in ${msg.guild} for ${reason}`);
        database.prepare("INSERT INTO warns (guild, user, reason, moderator) VALUES (@guild, @user, @reason, @moderator)").run({
            guild: msg.guild.id,
            user:member.user.id,
            reason:reason,
            moderator:mod.user.id
        });


    }
}