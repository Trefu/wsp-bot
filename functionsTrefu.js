require('./index')

const fetch = require("node-fetch");
const Personajes = require("./rpg-wsp/models");
const {
    player
} = require('./rpg-wsp/player');

String.prototype.startsWithCommand = function (list) {
    const str = this.split(" ");
    const firstWord = str[0]

    if (list.every(c => c !== firstWord)) return false;
    return true;
}




async function dameDolar() {
    try {
        const response = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error)
    }
};

function randomNum(num) {
    return Math.floor(Math.random() * num);
};

function msgFrom(msg, id) {
    return msg.author == id
};

function sendPj(msg, playerDueño) {

}

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
    const personaje = new Personajes(pj);
    personaje.save()
        .then(doc => console.log(doc))
        .catch(e => console.log(e))

}

const printPcStats = function (pc) {
    return `*${pc.name.toUpperCase()}*\n♥Salud: ${pc.hitpoints}\n✍🏿Dueño: ${pc.owner}\n⏫Nivel: ${pc.level}\n🛡Armadura: ${pc.ca}\n👁Experiencia: ${pc.exp}\n`
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
    let playersNames = await Personajes.find({}, 'name');
    playersNames = playersNames.map(obj => obj.name);
    return playersNames
}



/* const getPersonajes = async function {
    const personajes = await
} */


module.exports = {
    getRandomValueFromArr,
    randomNum,
    printTrackeables,
    playersNames,
    printPcStats
}