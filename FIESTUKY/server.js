var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

/*
var USER=process.env.USER;
var PASS=process.env.PASS;

*/


var user = 'altzi';
var pass = 'zubiri';
mongoose.connect('mongodb://'+user+':'+pass+'@ds035240.mongolab.com:35240/usuarios');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
	console.log('Conecction OK!!!');
});


/*
passport.serializeUser
passport.deserializeUser
*/
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

// public files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.redirect('index.html');
});

/*LOG*/
/*http://danialk.github.io/blog/2013/02/23/authentication-using-passportjs/*/
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password,done){
    Users.findOne({ username : username},function(err,user){
        if(err) { return done(err); }
        if(!user){
            return done(null, false, { message: 'Incorrect username.' });
        }

        pass( password, user.salt, function (err, pass) {
            if (err) { return done(err); }
            if (pass == user.pass) return done(null, user);
            done(null, false, { message: 'Incorrect password.' });
        });
    });
}));

/*************************************************/


/*Usuario*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var usuario = new Schema({
  username: String,
  pass: String,
  mail: String
});

module.exports = mongoose.model('Usuario', usuario);

/***************************************************/

app.get('/login', function(req, res){
  res.redirect('pagina.html');
});

require('./routes')(app);

app.listen(5000);
console.log('Servidor Express escuchando en el puerto 5000');