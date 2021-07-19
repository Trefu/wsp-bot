//MODULOS NECESARIOS
const fs = require("fs");
const rpgDiceRoller = require("rpg-dice-roller");
const qrcode = require("qrcode-terminal");
const SESSION_FILE_PATH = "./session.json";
//Mis funciones
const { prefixeCall } = require("./config.json");
const { playersNames, printPcStats, modifier } = require("./utils/utils");
const commandHandler = require('./commands/commandHandler')
var contacts;
let sessionCfg;
var players;


//para iniciar sesion con otro dispositivo borrar el archivo sessions.json
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const { Client } = require("whatsapp-web.js");
const { MessageMedia } = require("whatsapp-web.js");
//BASE DE DATOS MOONGOSE--------------------------------------------------------

require('./database')

//-----------------------------------------------------------------------------
// wsp web api pedrolopez github

const client = new Client({
  puppeteer: {
    headless: false,
  },
  session: sessionCfg
});

client.initialize();

client.on("authenticated", (session) => {
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", async () => {
  console.log("Client is ready!");
  /*   contacts = await client.getContacts();
    players = await Personajes.find();
    let test = await playersNames(); */
});


//al recibir un mensaje se lo pasa directamente al handler que se encarga de to2
client.on("message", commandHandler)
