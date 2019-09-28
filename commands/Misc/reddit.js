const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "reddit",
    alias: ["r"],
    description: "Searches for a random post on reddit / on a specified post.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let sReddit = args.length ? args[0].toLowerCase() : 'random';

        await fetch(`http://reddit.com/r/${sReddit}/random.json`)
            .then(async body => {

                json = await body.text();
                json = JSON.parse(json);

            });

        console.log(json[0].data.children[0].data.url.replace(/(\.gif)\w/, "$1"),json[0].data.children[0].data.permalink)
        json[0].data.children[0].data.selftext.slice(2048) 
        selftext = json[0].data.children[0].data.selftext || "Here is the post";
        image = json[0].data.children[0].data.url.match(/\.(\w){3}$/) || json[0].data.children[0].data.url.match(/gfycat/) ? json[0].data.children[0].data.url : undefined;
        
        let embed = new RichEmbed()
            .setTitle(json[0].data.children[0].data.title)
            .setDescription(`[${selftext}](${'https://www.reddit.com'+json[0].data.children[0].data.permalink})`)
            .setColor('RANDOM')
            .setTimestamp();

        if(image)
            if (!image.includes('gfycat'))
                embed.setImage(image);
            else
                embed.attachFile(image);

        await msg.channel.send(embed);

    }
}