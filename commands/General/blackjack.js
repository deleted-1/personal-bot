class Game {
    constructor() {
        this.cards = [];

        ["Spades", "Clubs", "Diamonds", "Hearts"].forEach(suit => {
            for (let i = 2; i < 11; i++)
                this.cards.push({ card: i + suit, value: i });

            ["A", "J", "Q", "K"].forEach(face => {
                let value = face == "A" ? 11 : 10;
                this.cards.push({ card: face + suit, value: value });
            });
        });
    }

    draw() {

        let index = Math.floor(Math.random() * this.cards.length);
        let card = this.cards[index];
        this.cards.splice(index, 1);

        return card;

    }
}

class Player {
    constructor() {

        this.user = [];
        this.score = 0;

    }
    hit(card) {

        this.score += card.value;
        this.user.push(card);

    }
    isBust() {

        if (this.score > 21) {
            this.user.map(card => {
                if (Object.keys(card)[0].match(/$A/)){
                    card.value = 2;
                    this.score -= 9
                }
                return card;
            });

            if (this.score > 21)    return true;
        }
        return false;
    }

}

module.exports = {
    name: "blackjack",
    alias: ["bj"],
    description: "Try to beat the dealer. (stand,hit,double)",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        let dealer = new Player();
        let user = new Player();
        let game = new Game();
        let onGoing = true;
        let quit = false;

        dealer.hit(game.draw());
        user.hit(game.draw());
        user.hit(game.draw());

        const show = dealer.score

        const scoreUpdate = async (score) => {await msg.channel.send(`Dealer's score: ${score || dealer.score}\nYour score: ${user.score}`);}
        const filter = m => m.author == msg.author && ['stand','hit','double'].includes(m.content.toLowerCase());

        while (onGoing) {

            await scoreUpdate(show);

            if (dealer.score <= 16)
                dealer.hit(game.draw());

            await msg.channel.awaitMessages(filter, {max:1, time:60000})
                .then(responses => {

                    let response = responses.first().content.toLowerCase();

                    if ('stand' != response) {

                        user.hit(game.draw());
                        if ('double' == response) onGoing = false;
                        else if (user.isBust()) onGoing = false;

                    }else onGoing = false;

                })
                .catch(error => {

                    if (!error)  return;

                    msg.reply('it seems you have gone afk, game closed.');
                    onGoing = false;
                    quit = true;

                });
        }
        await scoreUpdate()
        if (quit) return;
        if (user.isBust()) {

            msg.reply('you busted');

        }else if (dealer.isBust()) {

            msg.reply('I busted.')

        }else if (dealer.score < user.score) {

            msg.reply('you won');

        }else {

            msg.reply('I won');
        }

        console.log(user.score, dealer.score);
    }
}