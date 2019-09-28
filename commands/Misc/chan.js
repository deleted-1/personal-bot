const { JSDOM } = require('jsdom');
const { RichEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    name: "chan",
    alias: ["4chan"],
    description: "Gives you a random post from 4chan.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        if (!msg.channel.nsfw) return msg.reply('sorry mate but the channel has to be marked with the nsfw tag.');
        let board = args[0] || 'b'
        let image;

        try{
        await fetch(`http://boards.4chan.org/${board}/`)
            .then(async body => {

                let html = await body.text();
                const document = new JSDOM(html).window.document;

                post = Array.from(document.querySelectorAll('a')).find(a=>a.href.match(/thread\/(\d+)\/.+$/)).href;
                

                await fetch(`http://boards.4chan.org/${board}/`+post)
                    .then(async body => {

                        let html = await body.text();
                        const document = new JSDOM(html).window.document;

                        let title = document.getElementsByClassName('postMessage').innerText || document.getElementsByClassName('subject')[0].innerText || 'Anon\'s post';
                        image = document.querySelector('div.fileText > a').href;

                        let embed = new RichEmbed()
                            .setAuthor(msg.author.username,msg.author.avatarURL)
                            .setDescription(`[${title}](http://boards.4chan.org/${board}/${post})`)
                            .setImage('https:'+image)
                            .setColor('RANDOM');

                        msg.channel.send(embed);

                    });

            });
            
        }catch(err){
            if (!err) return;
            msg.reply('sorry something went wrong. Please ensure that is a valid board.')
        }

    }
}