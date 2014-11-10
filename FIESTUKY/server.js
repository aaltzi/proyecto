var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var session = require('express-session');
var passport = require('passport');
var LocalStrategy =require('passport-local').Strategy;

var user=process.env.USER;
var password=process.env.PASSWORD;


//var user = 'aaltzi';
//var password = 'zubiri';
mongoose.connect('mongodb://'+user+':'+password+'@ds049150.mongolab.com:49150/fiestuky');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
	console.log('Conecction OK!!!');
});

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session()); 
	app.use(app.router);
  app.use(bodyParser.urlencoded({ extended: false }));
  // public files
  app.use(express.static(__dirname + '/public'));
  app.use(session({ secret: 'topsecret',
                  saveUninitialized: true,
                  resave: true }));
  });

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var usuario = new mongoose.Schema({
  name: String,
  password: String
},{ collection : 'Users' });

var Users = mongoose.model('Users',usuario);

app.get('/', function(req, res){
	res.redirect('index.html');
});

/*************************************************/
// Recoger usuario local
passport.use(new LocalStrategy(
  function(username, password, done) {

    // usuario local
    console.log(username);
    console.log(password);


    Users.find({ name: username}, function (err, users) {
      if (err) return console.error(err);
      console.log('Find user:');
      console.log(users);

      // Desglose del usuario encontrado
      console.log(users[0].password);
      console.log(users[0].name);

      var hash = users[0].password;

      // compara usuario local(username y pass) con el de la base de datos(Users.name y .pass) 
      //if ((username == Users.name) && (bcrypt.compareSync(pass, hash))) {
      if ((username == users[0].name) && (password==hash)) {
        // login OK
        return done(null, username);
      } else {
        // login KO
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




app.post('/login',
  passport.authenticate('local', { successRedirect: '/loginSuccess',
                                   failureRedirect: '/loginFailure',
                                   failureFlash: false })
);

app.get('/', function(req,res) {
  res.redirect('index.html');
});

app.get('/loginFailure', function(req,res) {
  res.send('Login KO. username/pass incorrect');
});


app.get('/loginSuccess', ensureAuthenticated, function(req,res) {
  res.send('Login OK!!!');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/pagina.html');
}

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/***************************************************/

app.get('/login', function(req, res){
  res.redirect('pagina.html');
});

require('./routes')(app);

app.listen(5000);
console.log('Servidor Express escuchando en el puerto 5000');