require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

schema.statics.findByToken = function(token) {
  try {
    const payload = jwt.verify(token, process.env.APP_SECRET || 'A_SECRET');
    return Promise.resolve(this.hydrate({
      _id: payload.id,
      email: payload.email,
      __v: 0
    }));
  } catch(err) {
    return Promise.reject(err);
  }
};

schema.methods.authToken = function(){
  return jwt.sign(this.toJSON(), process.env.APP_SECRET || 'A_SECRET', {
    expiresIn: '24h'
  });
};

schema.statics.authorize = async function({ email, password }) {
  const user = await this.findOne({ email });
  if(!user) {
    const err = new Error('Invalid Email/Password, D00D!');
    err.status = 401;
    throw err;
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if(!validPassword) {
    const err = new Error('Invalid Email/Password, D00D!');
    err.status = 401;
    throw err;
  }

  return user;
};

module.exports = mongoose.model('User', schema);
