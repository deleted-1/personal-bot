const { JSDOM } = require('jsdom');
const { RichEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    name: "nsfw",
    alias: ["r34"],
    description: "Man shit, the title speaks for itself.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        if (!msg.channel.nsfw) return msg.reply('sorry mate but the channel has to be marked with the nsfw tag.');

        let image;

        if (!args.length)
            await fetch('https://rule34.xxx/index.php?page=post&s=random')
                .then(async body => {

                    let html = await body.text();
                    const document = new JSDOM(html).window.document;

                    image = document.getElementById("image");

                });
        else
            await fetch('https://rule34.xxx/index.php?page=post&s=list&tags='+args.join("+"))
                .then(async body => {

                    let html = await body.text();
                    const document = new JSDOM(html).window.document;

                    let links = Array.from(document.querySelectorAll('a')).filter(a => a.href.match(/index\.php\?page=post&s=view&id=(\d+)/)).map(a => a.href);
                    if(!links.length) return;

                    let link = links[Math.floor(Math.random()*(links.length-1))];
                    console.log(link)
                    await fetch('https://rule34.xxx/'+link)
                        .then(async body => {

                            let html = await body.text();
                            const document = new JSDOM(html).window.document;

                            image = document.getElementById("image");

                        })

                })
        
        
        if (!image) return msg.reply('no results');
        let embed = new RichEmbed()
            .setAuthor(msg.author.username,msg.author.avatarURL)
            .setDescription('Here you go :eyes:')
            .setImage(image.src)
            .setColor('RANDOM');
            
        msg.channel.send(embed);

    }
}