module.exports = {
    name: "echo",
    alias: ["say"],
    description: "Just echos what you say, nothing fancy.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        await msg.channel.send(args.join(" "));
        await msg.delete();

    }
}