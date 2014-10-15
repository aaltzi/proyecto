var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var user = 'altzi';
var pass = 'zubiri';
mongoose.connect('mongodb://'+user+':'+pass+'@ds035240.mongolab.com:35240/usuarios');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
	console.log('Conecction OK!!!');
});

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});


app.get('/', function(req, res){
	res.send('Hola mundo!!!');
});

require('./routes')(app);

app.listen(5000);
console.log('Servidor Express escuchando en el puerto 5000');
