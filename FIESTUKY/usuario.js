var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// La esquema para la base de datos de los usuarios
var usuario = new mongoose.Schema({
  name: String,
  password: String,
  mail: String
},{ collection : 'Users' });

module.exports = mongoose.model('Users', usuario);