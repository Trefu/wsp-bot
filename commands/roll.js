const rpgDiceRoller = require("rpg-dice-roller");
module.exports = async function (msg, args) {
    // r 1d20 texto sarasero
    const roll = args.shift();
    const action = args.join(" ") || ""
    try {
        const diceRoll = await new rpgDiceRoller.DiceRoll(roll);
        return msg.reply(`${diceRoll.output} ${action}`)
    }
    catch (e) {
        console.log(e.peg$SyntaxError)

        return msg.reply("tirada invalida.")
    }

}

