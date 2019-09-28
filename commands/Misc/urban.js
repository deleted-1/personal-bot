const fetch =  require('node-fetch');
const { JSDOM } = require('jsdom');

const { RichEmbed } = require('discord.js');

module.exports = {
    name: "urban",
    alias: ["ub"],
    description: "Gives you the top search on a urban dictionary page.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        query = args.join("+");
        
        if (!query)
            return msg.reply('you have to specify the word you would like to seach');

        await fetch('https://www.urbandictionary.com/define.php?term='+query)
            .then(async body => {

                let html = await body.text();
                const document = new JSDOM(html).window.document;

                let meaning = document.querySelector('div.meaning').textContent;
                let examples = document.querySelector('div.example').textContent.replace(/\t/g,"\n");
                let author = document.querySelector('div.contributor').textContent;

                if (!meaning)
                    throw 'invalid search parameters';

                let embed = new RichEmbed()
                    .setAuthor(author)
                    .setDescription(`${meaning}\n\n${examples}`)
                    .setColor("#000080")
                    .setFooter(client.user.username,client.user.avatarURL)
                    .setTimestamp();

                msg.channel.send(embed);

            })
            .catch(err => {
                if (err) {
                    console.log(err)
                    if (err == "invalid search parameters")
                        msg.reply(err)
                    else
                        msg.reply('something unexpected occured.');
                }
            });
        

    }
}