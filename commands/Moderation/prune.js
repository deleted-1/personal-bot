module.exports = {
    name: "prune",
    alias: ["delete"],
    description: "Delete x amount of messages.",
    permission: "MANAGE_MESSAGES",
    run: async (client, msg, args) => {

        let amount = parseInt(args[0]);
        if(!amount) return msg.reply('you have to specify the amount of messages you would like to delete.');

        await msg.delete();
        await msg.channel.bulkDelete(amount);

    }
}