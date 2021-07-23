const ID_TREFU = process.env.ID_TREFU;
const ID_BOT = process.env.ID_BOT;
const MY_IDS = [ID_BOT, ID_TREFU];
const { prefix } = require('../config.json');
const ver = require('./ver');
const test = require('./test');
const roll = require('./roll');
const spell = require('./spell');
const stats = require('./stats')

//guardo los comandos en un objecto para ejecutarlos de manera mas facil luego en la exportacion
const commands = {
    r: roll,
    ver,
    test,
    spell,
    stats
};

//chequea la validez del msg y ejecuta la correspondiente funcion
module.exports = async (msg) => {
    if (!msg.body.startsWith(prefix)) return;
    const args = msg.body.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();
    //chequea si el comando existe
    command in commands ?
        commands[command](msg, args) :
        msg.reply("comando no encontrado ")
}

