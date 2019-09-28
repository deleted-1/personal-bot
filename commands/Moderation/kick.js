const { RichEmbed } = require('discord.js');

module.exports = {
    name: "kick",
    alias: [],
    description: "Bans the user specified.",
    permission: "BAN_MEMBERS",
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
            }).catch(err => {
                if (err) return msg.reply('timed out. cancelling command.')
            });


        }

        if (member.highestRole.position >= mod.highestRole.position && mod !== msg.guild.owner) return msg.reply('you can\'t kick people with higher roles than you.');
        await member.kick({ reason:reason }).then(async ()=>{
            await msg.reply(`successfully kicked ${member} because ${reason}`);
        }).catch(err => {
            if (err) return msg.reply(`I could not kick that person please check my permissions`);
        });

        

    }
}