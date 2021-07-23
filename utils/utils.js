const players = require('../models/players')


function randomNum(num) {
    return Math.floor(Math.random() * num);
};

function msgFrom(msg, id) {
    return msg.author == id
};

function printPj(pj) {
    return `Nombre: ${pj.name}\nSalud: ${pj.hitpoints}\nCA: ${pj.ca}\nNivel: ${pj.level}\nEXP: ${pj.exp}\nClase: ${pj.clase}\n`
}

function printTrackeables(pj) {
    return `Nombre de personaje: ${pj.name}\nNivel de personaje: ${pj.level}\nHitpoints actuales: ${pj.hitpoints}\nCA(armadura): ${pj.ca}\nEXP: ${pj.exp}\n`
}

const getRandomValueFromArr = (arr) => {
    return arr[(Math.floor(Math.random() * arr.length))]
}

const savePlayer = function (pj) {
    const personaje = new players(pj);
    personaje.save()
        .then(doc => console.log(doc))
        .catch(e => console.log(e))

}
const printPcStats = function (pc) {
    return `*${pc.name}*\n💔Salud Actual: ${pc.hit_points}\n❤Salud Maxima: ${pc.max_hit_points}\n⏫Nivel: ${pc.level}\n🛡Armadura: ${pc.ca}\n👁Experiencia: ${pc.exp}\n`
}

const printPcModifiers = (pc) => {
    let txt = [];
    for (const s in pc.stats) {
        txt.push(`${s.toUpperCase()}: ${pc.stats[s]} (${modifier(pc.stats[s])})`);
    }
    return txt.join('\n')
}
const actChat = function (chat, players) {
    if (chat.isGroup) {
        var newDescription = "";
        //obtiene el texto para mostrar de cada personaje encontrado
        var playersPrintedStats = players.map(p => printTrackeables(p))
        newDescription = playersPrintedStats.join("\n\n")
        chat.setDescription(newDescription);
        return
    }
}
const playersNames = async function () {
    let playersNames = await players.find({}, 'name');
    playersNames = playersNames.map(obj => obj.name);
    return playersNames
}

const modifier = num => {
    const mod = Math.floor((num - 10) / 2)
    return Math.sign(mod) === 1 ? "+" + mod : mod;
}


module.exports = {
    getRandomValueFromArr,
    randomNum,
    printTrackeables,
    playersNames,
    printPcStats,
    modifier,
    printPcModifiers
}