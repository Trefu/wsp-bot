//pa leer las env
require("dotenv").config();

//MODULOS NECESARIOS
const fs = require("fs");
const rpgDiceRoller = require("rpg-dice-roller");
const qrcode = require("qrcode-terminal");
const mongoose = require("mongoose");
const SESSION_FILE_PATH = "./session.json";
//Mis funciones
const { prefix, diceCall } = require("./config.json");
const { playersNames, printPcStats, modifier } = require("./functionsTrefu");
const { rpg } = require("./rpg-wsp/Base");
const Personajes = require("./rpg-wsp/models");

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
}

const { Client } = require("whatsapp-web.js");
const { MessageMedia } = require("whatsapp-web.js");
const { get } = require("http");
const Personaje = require("./rpg-wsp/models");
const { player } = require("./rpg-wsp/player");

//BASE DE DATOS MOONGOSE--------------------------------------------------------
const URL = process.env.DATABASE;
const db = mongoose.connection;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.once("open", () => console.log("conectado a base de datos ✅✅✅✅✅"));

db.on("error", (error) => {
  console.log(error);
});

//-----------------------------------------------------------------------------
// wsp web api pedrolopez github

const client = new Client({
  puppeteer: {
    headless: false,
  },
  session: sessionCfg,
});

client.initialize();

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr, qrcode.generate(qr));
});

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

//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

client.on("ready", async () => {
  console.log("Client is ready!");
  contacts = await client.getContacts();
  players = await Personajes.find();
  let test = await playersNames();
});

client.on("message", async (msg) => {
  if (!msg.body.startsWith(prefix)) return;
  const args = msg.body.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  const chat = await msg.getChat();

  switch (command) {
    case "ver":
      const nameToFind = args[0].toLowerCase();
      const listOfNames = await playersNames();
      if (!listOfNames.includes(nameToFind))
        return msg.reply("Nombre no encontrado");
      const searchPc = await Personajes.find({
        name: nameToFind,
      });
      const PcFinded = searchPc[0];

      //crea el mensaje de tipo MEDIA con el tipo de formato, el codigo base64 traido de lab ase de datos y pone titulo al archivo
      const avatar = new MessageMedia("image", PcFinded.avatar, PcFinded.name);
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
      });
      break;
    case "roll":
      const tirada = args.shift();
      const accion = args.join(" ") || "";
      try {
        const diceRoll = new rpgDiceRoller.DiceRoll(tirada);
        msg.reply(`${diceRoll.output} ${accion}`);
      } catch (error) {
        console.log(error);
      }

      break;
    case "recibe":
      if (!MY_IDS.includes(msg.author))
        return msg.reply("no te desubiques manito");
      const name = args.shift();

      var Pc = await Personajes.findOne(
        {
          name: name,
        },
        "name owner hitpoints maxHitpoints exp"
      );

      if (!Pc) return msg.reply("No se encontro jugador");

      const received = args.shift();
      const n = parseInt(args.shift());

      if (isNaN(n)) return msg.reply("No se recibio numero");
      console.log(`arg ${received} nombre ${name} numero ${n}`);

      if (
        received === "exp" ||
        received === "experiencia" ||
        received === "xp"
      ) {
        Pc.exp += n;
        chat.sendMessage(
          `${Pc.name} Recibio ${n} de experiencia!, experiencia actual ${Pc.exp}`
        );
      }
      if (received === "daño") {
        Pc.hitpoints -= n;
        if (Pc.hitpoints <= 0) {
          Pc.hitpoints = 0;
          msg.reply(`${Pc.name} dañado, salud actual: ${Pc.hitpoints}`);
          chat.sendMessage(`${Pc.name} cae inconsciente`);
        }
      } else if (received === "cura" || received === "curacion") {
        Pc.hitpoints += n;
        if (Pc.hitpoints >= Pc.maxHitpoints) {
          Pc.hitpoints = Pc.maxHitpoints;
        }
        msg.reply(`${Pc.name} curado, salud actual: ${Pc.hitpoints}`);
      }

      Pc.save((e) => {
        if (e) return console.log(e);
      });
      break;

    default:
      console.log("error, no hay coincidencia de comandos en el switch");
  }
}) /
  client.on("message_revoke_everyone", async (after, before) => {
    const chatDel = await msg.getChat();
    // Fired whenever a message is deleted by anyone (including you)
    if (before && chatDel) {
      chatDel.sendMessage(before.body + " epa");

      console.log(before.body + "* borrado");
      return;
    }
  });
