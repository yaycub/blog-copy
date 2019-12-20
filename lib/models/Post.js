const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Tech', 'Political', 'Games', 'Movies', 'Music', 'Culture'],
    required: true
  }
});

module.exports = mongoose.model('Blog', schema);
