module.exports = {
    name: "stop",
    alias: ["stop"],
    description: "Stop the queue and exit the vc",
    permission: "VIEW_CHANNEL",
    run: async (client, {guild, channel, member}, args) => {

        if (!guild.me.voiceChannel) return channel.send('I am not playing music.');
        if ((member.hasPermission("MANAGE_CHANNELS") || guild.me.voiceChannel.members.filter(m => !m.user.bot).size === 1) && guild.me.voiceChannel.members.find(m=>m.id === member.id)) {

            await guild.me.voiceChannel.leave();
            channel.send('I have left the voice channel.');

        }else return channel.send('You do not have permission to stop. Make sure you have MANAGE__CHANNELS or is the only person in the vc (You have to be in the vc for this command to work).');
        
    }
}