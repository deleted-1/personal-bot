const { RichEmbed } = require('discord.js');

module.exports = {
    name: "mute",
    alias: ["silence"],
    description: "",
    permission: "MANAGE_ROLES",
    run: async (client, msg, args) => {

        if (!msg.guild.me.permissions.has("MANAGE_ROLES")) return msg.reply('check my permissions.');

        let role = msg.guild.roles.find(r => r.name == "Muted") || await msg.guild.createRole({
            name: "Muted",
            color: [0,0,0],
            position: msg.guild.me.highestRole.position-1,
            permissions: 0,
            mentionable: true
        }).then(async role => {
            msg.guild.channels.forEach(ch => {
                ch.overwritePermissions(role,{SEND_MESSAGES:false});
            });
        });       
        let member = msg.mentions.members.first();

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

        if (member.highestRole.position >= msg.member.highestRole.position && msg.member !== msg.guild.owner) return msg.reply('you can\'t mute people with higher roles than you.');
        await member.addRole(role).then(async ()=>{
            await msg.reply(`successfully muted ${member}.`);
        }).catch(err => {
            if (err) return msg.reply(`I could not mute that person please check my permissions`);
        });

    }
}