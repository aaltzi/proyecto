//http://www.desarrolloweb.com/manuales/manual-nodejs.html

// DEPENDENCIAS
var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var session = require('express-session');
var passport = require('passport');
var LocalStrategy =require('passport-local').Strategy;

// CONEXIÓN BASE DE DATOS
// var user=process.env.USER;
// var password=process.env.PASSWORD;
var user="aaltzi";
var password="zubiri";
mongoose.connect('mongodb://'+user+':'+password+'@ds049150.mongolab.com:49150/fiestuky');
var db = mongoose.connection;
// comprobar conexión
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
	console.log('Conecction OK!!!');
});

// Configuración de las dependencias...
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session()); 
	app.use(app.router);
  app.use(bodyParser.urlencoded({ extended: false }));
  // aceso a la carpeta public para las imagenes y los html
  app.use(express.static(__dirname + '/public'));
  // Enciptacion de sesion
  app.use(session({ secret: 'topsecret'}));
  app.use(session({
                  resave:true,
                  saveUninitialized:true,
                  secret:'uwotm8'
                })
  );
  });

var Users = require('./usuario');
// Passport 
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  Users.findById(id, function(err, user) {
    done(err, user);
  });
});

// Recoger usuario local
passport.use(new LocalStrategy(
  function(username, password, done) {

    // usuario local
    console.log(username);
    console.log(password);

    // Comparar el ususario introducido con el de la base de datos
    Users.find({ name: username}, function (err, users) {
      if (err) return console.error(err);
      
      // Comprobaciones por consola
      console.log('Find user:');
      console.log(users);
      console.log(users[0].password);
      console.log(users[0].name);
      // Recoger la contraseña en una variable
      var hash = users[0].password;
      // Comparar el usuario de la base de datos y el que se ha introducido
      if ((username == users[0].name) && (password==hash)) {
        // login Bien
        return done(null, username);
      } else {
        // login Mal
        // Comprobaciones
        console.log("resultados:");
        console.log("usuario local: "+username);
        console.log("usuario db: "+users[0].name);
        console.log("contraseña local: "+password);
        console.log("contraseña bd: "+users[0].password);
        return done(null, false);
      }
    });
  }
));

// Accion al hacer el login
app.post('/login',
  passport.authenticate('local', { successRedirect: '/loginSuccess',
                                   failureRedirect: '/loginFailure',
                                   failureFlash: false })
);
// Login bien o mal
app.get('/loginFailure', function(req,res) {
  res.send('Login KO. username/pass incorrect');
});
app.get('/loginSuccess', ensureAuthenticated, function(req,res) {
  res.send('Login OK!!!');
});

app.post('/register', function(req, res) {
  // attach POST to user schema
  var user = new Users({
    name: req.body.user2,
    password: req.body.pass2,
    mail: req.body.mail
  });
  // save in Mongo
  user.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('user: ' + req.body.user2 + " saved.");
      req.login(user, function(err) {
        if (err) {
          console.log(err);
        }
        return res.redirect('/pagina.html');
      });
    }
  });
});
function loggedIn(req, res, next) {
    if (req.user) {
        console.log('HOLA!'+req.user);
        next();
    } else {
      console.log('HOLA!'+req.user);
        res.redirect('/login');
    }
}
app.get('/consulta', loggedIn, function(req, res, next) {
    // req.user - will exist
    // load user orders and render them
});
// Comprobar la autentificacion del usuario para que no
// se pueda acceder de otra manera
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/pagina.html');
}


require('./routes')(app);
// Escuchar en el puerto 5000 el servidor Express
/*app.listen(5000);
console.log('Servidor Express escuchando en el puerto 5000');*/

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080 || 5000; 
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(port,ip);
console.log('Servidor Express escuchando en el puerto 8080');
