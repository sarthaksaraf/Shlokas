const mongoose = require('mongoose');

const shlokSchema = new mongoose.Schema({
  chapter: { type: Number, required: true },
  verse: { type: Number, required: true },
  shlok: { type: String, required: true },
  transliteration: { type: String, required: true },
  translation: { type: String, required: true },
  meaning: { type: String, required: true },
  mood: { type: mongoose.Schema.Types.Mixed, required: true},
  message: { type: String, required: true }
});
const Shlok = mongoose.model('Shlok', shlokSchema, 'shlokas');

module.exports = Shlok;
