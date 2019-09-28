module.exports = {
    name: "pause",
    alias: [""],
    description: "",
    permission: "VIEW_CHANNEL",
    run: async (client, { channel, guild, member }, args) => {

        if (!guild.me.voiceChannel) return channel.send('I am not playing music.');
        if ((member.hasPermission("MANAGE_CHANNELS") || guild.me.voiceChannel.members.filter(m => !m.user.bot).size === 1) && guild.me.voiceChannel.members.find(m=>m.id === member.id)) {

            if (client.dispatchers.get(guild.id)){
                client.dispatchers.get(guild.id).pause();
                channel.send('The player has been paused.');
            }


        }else return channel.send('You do not have permission to pause. Make sure you have MANAGE__CHANNELS or is the only person in the vc (You have to be in the vc for this command to work).');

    }
}