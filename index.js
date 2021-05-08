//pa leer las env
require("dotenv").config();

//MODULOS NECESARIOS
const fs = require("fs");
const fetch = require("node-fetch");
const rpgDiceRoller = require('rpg-dice-roller');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const SESSION_FILE_PATH = './session.json';

//Mis funciones
const {
    prefix,
    diceCall
} = require("./config.json")
const {
    randomNum,
    savePlayer,
    getPlayers,
    actChat
} = require("./functionsTrefu");
const {
    rpg
} = require("./rpg-wsp/Base");
const commands = [prefix, diceCall];
const dndApiUrl = "https://www.dnd5eapi.co";
const ID_TREFU = process.env.ID_TREFU;
const ID_BOT = process.env.ID_BOT;
const MY_IDS = [ID_BOT, ID_TREFU];
var contacts;
let sessionCfg;
var players;

String.prototype.startsWithCommand = function (list) {
    const str = this.split(" ");
    const firstWord = str[0]

    if (list.every(c => c !== firstWord)) return false;
    return true;
}
//para iniciar sesion con otro dispositivo borrar el archivo sessions.json
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
};

const {
    Client
} = require('whatsapp-web.js');
const {
    MessageMedia
} = require('whatsapp-web.js');
const {
    get
} = require('http');
const Personaje = require("./rpg-wsp/models")
const {
    player
} = require("./rpg-wsp/player");
const {
    checkServerIdentity
} = require("tls");

//BASE DE DATOS MOONGOSE--------------------------------------------------------
const URL = process.env.DATABASE
const db = mongoose.connection;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

db.once('open', () => console.log("conectado a base de datos ✅✅✅✅✅"));

db.on('error', error => {
    console.log(error)
})

//-----------------------------------------------------------------------------
// wsp web api pedrolopez github

const client = new Client({
    puppeteer: {
        headless: false,
        executablePath: "C:/Program Files/Google/Chrome/Application/Chrome"
    },
    session: sessionCfg
});

client.initialize();

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr, qrcode.generate(qr));
});

client.on('authenticated', (session) => {
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

client.on('ready', async () => {
    console.log('Client is ready!');
    contacts = await client.getContacts();
    players = await getPlayers().then("Personajes cargados ✅")

});


client.on("message", async msg => {
        if (!msg.body.startsWithCommand(commands)) return;
        const args = msg.body.trim().split(" ")
        const command = args.shift().toLowerCase();
        const chat = await msg.getChat();
        console.log(command)
        if (msg.body.startsWith(diceCall)) {
            const tirada = args.shift()
            const accion = args.join(" ") || ""
            try {
                const diceRoll = new rpgDiceRoller.DiceRoll(tirada)
                msg.reply(`${diceRoll.output} ${accion}`)
            } catch (error) {
                console.log(error)
            }

        }

        /* switch (command) {

            case "getgrupo":
                if (!IDS_MIAS.includes(msg.author)) return msg.reply("Comando reservado")
                if (chat.isGroup) {
                    //array de ids de miembros en el grupo
                    var contactsInGroup = [];
                    const chatGroupIds = chat.participants.map(member => member.id._serialized);
                    for (let id of chatGroupIds) {
                        var res = contacts.filter(user => user.id._serialized === id);
                        res[0].isMe ? res : contactsInGroup.push(res[0]);
                    }
                    console.log(contactsInGroup)
                    contactsInGroup.forEach(c => chat.sendMessage("alo " + c.pushname))
                }
                break;
            case "randomitem":
                if (!IDS_MIAS.includes(msg.author)) return msg.reply("Comando reservado")
                fetch("https://www.dnd5eapi.co/api/magic-items")
                    .then(res => res.json())
                    .then(data => {
                        var dndItems = data.results
                        var item = dndItems[randomNum(data.count)]
                        msg.reply(`${item.name}`)
                    })
                    .catch(error => console.log(error))

                break;

            case "daño":
                if (!IDS_MIAS.includes(msg.author)) return msg.reply("Comando reservado");
                var damage = args[1];
                var nameTarget = args[0];
                var character = players.find(p => p.name == nameTarget);
                character.hitpoints -= damage;
                if (character.hitpoints <= 0) {
                    character.hitpoints = 0;
                    chat.sendMessage(`${character.name} esta inconsciente`)
                }
                actChat(chat, players);

                break;
            case "cura":
                if (!IDS_MIAS.includes(msg.author)) return msg.reply("Comando reservado");
                var heal = args[1];
                var nameTarget = args[0];
                var character = players.find(p => p.name == nameTarget);
                character.hitpoints += heal;
                if (character.hitpoints > character.maxHitpoints) character.hitpoints = character.maxHitpoints;
                actChat(chat, players);

                break;
            default:
                msg.reply("Comando inexistente")
                break;
        } */
    })

    /
    client.on('message_revoke_everyone', async (after, before) => {

        // Fired whenever a message is deleted by anyone (including you)
        console.log(before.body + "* borrado")

    });