module.exports = {
    name: "ping",
    alias: ["ping"],
    description: "Returns the bot client's ping",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let firstTimestamp = new Date(msg.createdTimestamp)

    msg.channel.send("Pong! ").then(sentMessage => {
        sentMessage.edit("Pong! " + (new Date(sentMessage.createdTimestamp).getTime() - firstTimestamp.getTime()) + "ms")
    });

    }
}