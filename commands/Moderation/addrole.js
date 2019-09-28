const { RichEmbed } = require('discord.js');

module.exports = {
    name: "addrole",
    alias: ["role"],
    description: "Adds a role to the user specified. <user> \"<role>\" ",
    permission: "MANAGE_ROLES",
    run: async (client, msg, args) => {

        let member = msg.mentions.members.first();
        let role = msg.mentions.roles.first();
        if(!role){
            role = args.slice(1).join(" ").match(/^"(.+)"$/) ? args.slice(1).join(" ").replace(/^"(.+)"$/, "$1") : undefined;
            role = msg.guild.roles.find(r => r.name == role);
        }

        if(!role) return msg.reply(`invalid role. Please make sure the encase the role with quotation marks`);

        if(member)
            member.addRole(role.id).catch(err => {
                if (err) return msg.reply('there was an error when trying to add the role. Please ensure I have the correct permissions.');
            }).then(()=>{
                msg.reply('successfully added their role.');
            });
        else{

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
                msg.guild.members.find(m => m.user.tag == members[parseInt(response.first())-1]).addRole(role).catch(err =>{
                    if (err) return msg.reply('there was an error when trying to add the role. Please ensure I have the correct permissions.');
                }).then(()=>{
                    msg.reply('successfully added their role.')
                });
            }).catch(err => {
                if (err) return msg.reply('timed out. cancelling command.')
            });
;

        }
    }
}