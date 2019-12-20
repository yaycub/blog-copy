const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email:{
    type: String,
    unique: [true, 'Email is taken'],
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

module.exports = mongoose.model('User', schema);
