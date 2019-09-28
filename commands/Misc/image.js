const gis = require('g-i-s');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: "image",
    alias: ["image"],
    description: "Brings first result of an image on google",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let search = args.join(" ");

        if (!search)
            return msg.reply('invalid search parameters.');

        message = msg;
        await gis(search,logResults); 

    }
}

async function logResults(err, results){
    if (err) 
        return console.log(err);
    
    let image = results[Math.floor(Math.random()*results.length)].url;
    let embed = new RichEmbed()
        .setImage(image);

    message.channel.send(embed);
        
}