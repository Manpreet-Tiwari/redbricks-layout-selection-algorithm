const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    name: String,
    score: {
        math: Number,
        english: Number,
        science: Number
    }
});
const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;