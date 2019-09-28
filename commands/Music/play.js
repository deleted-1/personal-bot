const ytdl = require('ytdl-core');
const { RichEmbed } = require('discord.js');
const search = require('youtube-search');
const opts = require('../../credentials.json');

const play = async (client, channel, connection) => {

    let dispatcher = client.dispatchers.get(channel.guild.id) || {destroyed: true};
    
    async function stream(song){
        
        if (!song) return;
        const readableStream = ytdl(song, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });

        const { author, player_response, title }= await ytdl.getBasicInfo(song);
        const videoDetails = player_response.videoDetails;
        const minutes = Math.floor(videoDetails.lengthSeconds / 60).toString().replace(/^(\d)$/, '0$1');
        const seconds = (videoDetails.lengthSeconds - (Number(minutes) * 60)).toString().replace(/^(\d)$/, '0$1');
        
        const embed = new RichEmbed()
            .setAuthor(author.name, author.avatar)
            .setThumbnail(videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length-1].url)
            .setDescription(`**[${title}(${minutes}:${seconds})](${song})**`)
            .setColor('#ed2415')
            .setTimestamp()
            .setFooter('Now Playing!', client.user.avatarURL);

        await channel.send(embed);

        dispatcher = connection.playStream(readableStream);
        client.dispatchers.set(channel.guild.id, dispatcher);
        
        client.dispatchers.get(channel.guild.id).on("end", (reason) => {
            let q = client.queue.get(channel.guild.id).slice(1);
            client.queue.set(channel.guild.id,q);
            stream(client.queue.get(channel.guild.id)[0]);
        });

    }
    
    if (dispatcher.destroyed) stream(client.queue.get(channel.guild.id)[0]);

}

const queue = async (client, channel, song) => {
    try{
        await ytdl(song, {
            quality: 'highestaudio',
            filter: 'audioonly'
        })
    } catch(err) {
        
        song = undefined
        
    }

    let q = client.queue.get(channel.guild.id);
    if (!q && song)
        client.queue.set(channel.guild.id, [song]);
    else if (song)
        client.queue.set(channel.guild.id, [...q, song]);
    else
        return channel.send('It appears I am unavailable to retreive that link.');

    
        
        
}

const find = async (client, channel, member, q) =>{ 
    
    await search(q,opts, async function(err, results) {
        if(err) return console.log(err);
        
        let embed = new RichEmbed()
            .setColor('#ed2415')
            .setTitle('**__Song Selection__**')
            .setTimestamp()
            .setFooter(`Choose a number between 1 - ${results.length}. Expires in 10s`,client.user.avatarURL);

        let i = 1
        let resultsMod = results.map(result => `**${(i++).toString().replace(/^(\d)$/,'0$1')}.** ${result.title} **[${result.channelTitle}]**`);
        embed.setDescription(`\n${resultsMod.join("\n")}`);

        await channel.send(embed);
        await channel.awaitMessages(m => m.author.id == member.id && Number(m.content) > 0 && m.content < results.length, {max:1, time:10000})
            .then(async (collected) => {
                let index = Number(collected.first().content);
                song = results[index-1].link;
                await channel.send(`${results[index-1].title} has been added to the queue.`)
            })
            .catch(async (err) => {
                if (err) {
                    await channel.send('Time has ran out. (I automatically selected the first one)');
                    song = results[0].link;
                }
            });
    
        let connection = await member.voiceChannel.join();
        if (!channel.guild.me.voiceChannel) {
            await member.voiceChannel.leave();
            connection = await member.voiceChannel.join();
        }

        await queue(client, channel, song);
        await play(client, channel, connection);

    });
    
}
module.exports = {
    name: "play",
    alias: ["p"],
    description: "Place music into the queue.",
    permission: "VIEW_CHANNEL",
    run: async (client, {channel, member, guild}, args) => {

        let song = args[0].match(/^https:\/\/?(www\.youtube\.com || youtu\.be)\/.+$/) && args[0];

        if (!member.voiceChannel) return channel.send('You have to be in a voice channel to use this command.');
        if (guild.me.voiceChannelID && guild.me.voiceChannelID !== member.voiceChannelID) return channel.send('I am already playing music.');
        if (!song) await find(client, channel, member, args.join(" "));
        else {

            let connection = await member.voiceChannel.join();
            if (!guild.me.voiceChannel) {
                await member.voiceChannel.leave();
                connection = await member.voiceChannel.join();
            }

            await queue(client, channel, song);
            await play(client, channel, connection);
        }
    }
}