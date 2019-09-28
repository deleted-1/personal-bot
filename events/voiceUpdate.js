module.exports = {
    name: "voiceUpdate",
    run: async (client, oMember, { guild }) => {
    
        if (oMember.id == client.user.id) {
            if (!guild.me.voiceChannel) {
                
                client.queue.set(guild.id, []);
                if (client.dispatchers.get(guild.id))
                    client.dispatchers.get(guild.id).end();

            }
            if (guild.me.serverMute) {
                setTimeout(()=>{
                    if (guild.me.serverMute) client.queue.set(guild.id, []);
                },10000);
            }
        }
    }
}