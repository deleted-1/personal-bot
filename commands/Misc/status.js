module.exports = {
    name: "status",
    alias: ["s"],
    description: "Sets the gameplay status of the bot.",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        if (!["333612582357303297","316671807052578827"].includes(msg.author.id)) return;

        client.user.setPresence({ game: { name: args.join(" ") }, status: 'online' });

    }
}