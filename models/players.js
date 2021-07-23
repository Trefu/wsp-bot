const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Inventory } = require('./inventory');

const PlayersSchema = new Schema({
    owner: {
        type: String
    },
    name: {
        type: String
    },
    hit_points: {
        type: Number

    },
    max_hit_points: {
        type: Number
    },
    temporal_hit_points: {
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
    },
    inventory: {
        type: Inventory
    },
    features: {
        race_feature: [],
        class_feature: [],
        special_features: []
    }

})



module.exports = mongoose.model('Players', PlayersSchema, 'personajes');