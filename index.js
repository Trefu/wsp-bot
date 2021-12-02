//MODULOS NECESARIOS
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const commandHandler = require('./commands/commandHandler')
const SESSION_FILE_PATH = "./session.json";

require('./database')

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
  session: sessionData,
  puppeteer: {
    headless: false
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
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
});

client.initialize();

//al recibir un mensaje se lo pasa directamente al handler que se encarga de to2
client.on("message", commandHandler)
