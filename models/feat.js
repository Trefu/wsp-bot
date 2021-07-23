const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Feat = new Schema({
    desc: { type: String },
    name: { type: String },
});

module.exports = mongoose.model('Feat', Feat, 'traits');