var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    unique: false
  },

  inbox: {
    type: Array,
    required: false,
    unique: false
  },

  album: {
    type: Array,
    required: false,
    unique: false
  }

});

module.exports = mongoose.model('User', UserSchema);
