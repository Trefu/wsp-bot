const {
    Schema,
    model
} = require("mongoose");

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

    }

})



module.exports = model('Personajes', PersonajesSchema);