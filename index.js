//pa leer las env
require("dotenv").config();

//MODULOS NECESARIOS
const fs = require("fs");
const fetch = require("node-fetch");
const rpgDiceRoller = require('rpg-dice-roller');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const SESSION_FILE_PATH = './session.json';
const Personajes = require('./rpg-wsp/models')
//Mis funciones
const {
    prefix,
    diceCall
} = require("./config.json")
const {
    playersNames,
    printPcStats
} = require("./functionsTrefu");
const {
    rpg
} = require("./rpg-wsp/Base");


const commands = [prefix, diceCall, "ver"];

const dndApiUrl = "https://www.dnd5eapi.co";
const ID_TREFU = process.env.ID_TREFU;
const ID_BOT = process.env.ID_BOT;
const MY_IDS = [ID_BOT, ID_TREFU];
var contacts;
let sessionCfg;
var players;


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
    players = await Personajes.find();
    let test = await playersNames()
    console.log(test);
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
        if (msg.body.startsWith(prefix)) return console.log("prefixdeado")

        switch (command) {
            case "ver":
                const nameToFind = args[0].toLowerCase();
                const listOfNames = await playersNames();
                if (!listOfNames.includes(nameToFind)) return msg.reply("Nombre no encontrado")
                const searchPc = await Personajes.find({
                    "name": nameToFind
                });
                const PcFinded = searchPc[0];
                console.log(PcFinded)
                var characterMsgStats = printPcStats(PcFinded)
                for (const s in PcFinded.stats) {
                    characterMsgStats = characterMsgStats.concat(
                        `\n${s.toUpperCase()} ${PcFinded.stats[s]}\n`
                    )

                }
                chat.sendMessage(characterMsgStats)



                break;

            default:
                console.log("error, no hay conicindiencai de comandos en el switch")
        }
    })

    /
    client.on('message_revoke_everyone', async (after, before) => {

        // Fired whenever a message is deleted by anyone (including you)
        console.log(before.body + "* borrado")

    });