
const { printPcStats, printPcModifiers } = require('../utils/utils')
const players = require('../models/players');
const { MessageMedia } = require('whatsapp-web.js');
module.exports = async function (msg, args) {
    try {
        const idOwner = msg.author;
        const chat = await msg.getChat();
        const PC = await players.findOne({ owner: idOwner });
        const avatar = await new MessageMedia("image", PC.avatar, PC.name);
        console.log(PC.max_hit_points, PC.max_hit_points)
        const formatedStats = printPcStats(PC);
        chat.sendMessage(`${formatedStats}\n${printPcModifiers(PC)}`, {
            media: avatar
        })
    }
    catch (e) {
        console.log(e)
        msg.reply("algo salio mal xD")
    }

    /* 
        //texto que acompaña la imagen
        var characterMsgStats = printPcStats(PcFinded);
        //por cada stat del personaje, lo concatena al texto de acompañamiento
        for (const s in PcFinded.stats) {
            characterMsgStats = characterMsgStats.concat(
                `\n${s.toUpperCase()}: ${PcFinded.stats[s]} (${modifier(
                    PcFinded.stats[s]
                )})\n`
            );
        }
        chat.sendMessage(characterMsgStats, {
            media: avatar,
        }); */

}

