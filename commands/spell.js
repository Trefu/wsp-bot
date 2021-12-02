const API_URL = "https://www.dnd5eapi.com";
const fetch = require('node-fetch');
module.exports = async function (msg, args) {

    const formatter = function (json) {
        const formated = {};
        formated.name = `*${json.name.toUpperCase()}*`;
        formated.description = `\`\`\`${json.desc[0]}\`\`\``;
        formated.components = json.components.map(component => `*${component}* `).join("");
        formated.range = json.range || "";
        formated.duration = json.duration;
        formated.ritual = json.ritual ? "*RITUAL*" : "";
        formated.concentration = json.concentration ? "Requiere *Concentración*" : "";
        formated.casting_time = json.casting_time;
        formated.tier = json.level;
        formated.school = json.school.name;
        formated.classes = json.classes.map(c => `*${c.name}*`).join(", ")
        formated.higher_level = json.higher_level ? `\`\`\`${json.higher_level[0]}\`\`\`` : "";
        console.log(formated)
        return formated
    }

    const SPELL_NAME = args.join("-")
    if (SPELL_NAME === "") return msg.reply("No spell name");
    const response = await fetch('https://www.dnd5eapi.co/api/spells/' + SPELL_NAME);
    const resJson = await response.json()
    if (resJson.error) return msg.reply("What do we broke?*")
    const spellFormated = formatter(resJson);

    msg.reply(`
    ${spellFormated.name}
    _Tier:_ _${spellFormated.tier}_ _Escuela:_ _${spellFormated.school}_\n
    Tiempo de casteo: ${spellFormated.casting_time}
    Componentes: ${spellFormated.components}
    Duración: ${spellFormated.duration}
    Clases: ${spellFormated.classes}
    Rango: ${spellFormated.range}

    ${spellFormated.description}

    ${spellFormated.higher_level}

    ${spellFormated.ritual} ${spellFormated.concentration}`);
}

