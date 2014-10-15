var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var usuario = new Schema({
	nombre: String,
	pass: String,
	correo: String
});

module.exports = mongoose.model('Usuario', usuario);
