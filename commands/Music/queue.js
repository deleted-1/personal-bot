const { RichEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

const handleEmbed = async (client, queue, msg) => {

    let embeds = [];
    let i = 1;
    let page = []

    let voiceChannel = msg.guild.me.voiceChannel;
    let invite = await voiceChannel.createInvite();

    let response = await ytdl.getBasicInfo(queue[0]);
    let videoDetails = response.player_response.videoDetails;
    let minutes = Math.floor(videoDetails.lengthSeconds / 60).toString().replace(/^(\d)$/, '0$1');
    let seconds = (videoDetails.lengthSeconds - (Number(minutes) * 60)).toString().replace(/^(\d)$/, '0$1');

    let embed = new RichEmbed()
        .setDescription(`[Queue of ${voiceChannel.name}](${invite.url})`)
        .addField('Now Playing',`[${response.title}](${queue[0]}) | \`\`${minutes}:${seconds}\`\``)
        .setColor('#ed2415')
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp();

    await queue.forEach(async song => {
        
        response = await ytdl.getBasicInfo(song)
        videoDetails = response.player_response.videoDetails;
        minutes = Math.floor(videoDetails.lengthSeconds / 60).toString().replace(/^(\d)$/, '0$1');
        seconds = (videoDetails.lengthSeconds - (Number(minutes) * 60)).toString().replace(/^(\d)$/, '0$1');

        page.push(`\`${page.length+1}.\` [${response.title}](${song}) | \`\`${minutes}:${seconds}\`\``);

        if ((queue.indexOf(song)+1) % 10 == 0) {
            embed.addField('Queued', page.join("\n"))
            embeds.push(embed);
            page = []
            embed = new RichEmbed()
                .setColor('#ed2415')
                .setTimestamp()
                .setFooter(`Page ${++i}`)
        }

        if (queue.indexOf(song)+1 == queue.length) {

            let c = 0 // Current embed
            if (queue.length % 10 !== 0) embeds.push(embed);
            const message = await msg.channel.send(embeds[c]);
        
            if (embeds.length > 1) {
                await message.react("⬅");
                await message.react("➡");
            }
        
            const filter = (reaction, user) => ['⬅','➡'].includes(reaction.emoji.name) && !user.bot;
            await message.awaitReactions(filter).then(reactions => {
                reactions = reactions.map(r => r.emoji.name);
                let reaction = reactions[reactions.length-1];
                if (reaction === '⬅' && c)
                    --c
                else if (c < embeds.length-1)
                    ++c
        
                message.edit(embeds[c]);
            });

        }
                    
    });



}

module.exports = {
    name: "queue",
    alias: ["q"],
    description: "",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let queue = client.queue.get(msg.guild.id) || {length: false};
        console.log(queue)
        if (!queue.length) return msg.channel.send(':x: Nothing playing in this server.');

        await handleEmbed(client, queue, msg); 

    }
}