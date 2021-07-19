const mongoose = require('mongoose');
const { Schema } = mongoose;

const PersonajesSchema = new Schema({
    owner: {
        type: String
    },
    name: {
        type: String
    },
    hitpoints: {
        type: Number

    },
    maxHitpoints: {
        type: Number
    },
    temporalHitpoins: {
        type: Number,
        default: 0
    },
    exp: {
        type: Number,
        default: 0
    },
    ca: {
        type: Number,
        default: 10
    },
    level: {
        type: Number,
        default: 1
    },
    clase: {
        type: String

    },
    avatar: {
        data: Buffer,
        contentType: String
    },
    stats: {
        type: Object,
        fuerza: {
            type: Number
        },
        destreza: {
            type: Number
        },
        constitucion: {
            type: Number

        },
        inteligencia: {
            type: Number

        },
        sabiduria: {
            type: Number

        },
        carisma: {
            type: Number
        }
    }

})



module.exports = model('Personajes', PersonajesSchema);