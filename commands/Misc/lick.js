const { JSDOM } = require('jsdom');
const { RichEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    name: "lick",
    alias: ["lick"],
    description: "lick a user 👅",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let user = msg.mentions.users.first();
        let gif;

        if(!user) return msg.reply('you have to mention the user you would like to slap. d\'oi.');

        await fetch('https://tenor.com/search/lick-anime-gifs')
            .then(async body => {

                let html = await body.text();
                const document = new JSDOM(html).window.document;

                let gifs = Array.from(document.querySelectorAll('#view > div > div.gallery-container > div > div > div > figure > a'));
                gif = gifs[Math.floor(Math.random()*gifs.length)].href;

                console.log(gif)

                await fetch('https://tenor.com'+gif)
                    .then(async body => {

                        let html = await body.text();
                        const document = new JSDOM(html).window.document;

                        gif = Array.from(document.querySelectorAll('img')).find(i => i.src.includes('gif')).src;

                     })

            });


        if(!gif) msg.reply('my owner did something stupid. Contact him to fix this error.');

        let embed = new RichEmbed()
            .setAuthor(msg.author.username,msg.author.avatarURL)
            .setDescription(`${msg.author} licks ${user} :see_no_evil:`)
            .setImage(gif)
            .setFooter(``,client.user.avatarURL)
            .setTimestamp()
            .setColor('RANDOM');
            
        msg.channel.send(embed);

    }
}