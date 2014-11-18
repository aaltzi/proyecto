module.exports = function(app) {

	var Usuario = require('./usuario');

	// GET
	findAllUsuarios = function(req,res) {
		Usuario.find(function(err,usuarios) {
			if(!err) res.send(usuarios);
			else console.log('ERROR: '+err);
		});
	};

	// GET
	findById = function(req, res) {
		Usuario.findById(req.params.id, function(err, usuario){
			if(!err) res.send(usuario);
			else console.log('ERROR: '+err);
		});
	};

	// POST
	addUsuario = function() {
		console.log('POST');
		console.log(req.body);

		var usuario = new Usuario({
			nombre: req.body.nombre,
			pass: req.body.pass,
			correo: req.body.correo
		});

		usuario.save(function(err) {
			if(!err) console.log('Usuario Guardado!');
			else console.log('ERROR: '+err);
		});

		res.send(usuario);
	};

	// PUT (Update)
	updateUsuario = function(req, res) {
		Usuario.findById(req.params.id, function(err, usuario){
			usuario.nombre= req.body.nombre;
			usuario.pass= req.body.pass;
			usuario.correo= req.body.correo;
		});

		usuario.save(function(err) {
			if(!err) console.log('Usuario Actualizado!');
			else console.log('ERROR: '+err);
		});
	};

	// DELETE
	deleteUsuario = function(req, res){
		Usuario.findById(req.params.id, function(err, usuario) {
			usuario.remove(function(err) {
				if(!err){
					console.log('Usuario Borrado!');
					res.redirect('/');
				}else{
					console.log('ERROR: '+err);
				}
			});
		});
	}

	// API Routes
	app.get('/usuarios', findAllUsuarios);
	app.get('/usuarios/:id', findById);
	app.post('/usuario_nuevo', addUsuario);
	app.put('/usuarios_editar/:id', updateUsuario);
	app.get('/usuarios_borrar/:id', deleteUsuario);

	///*************************///

	// Redirecciones
// Salir de la sesion ...¿?
app.get('/logout', function(req, res){
  //req.logout();
  res.redirect('/');
});
app.get('/', function(req,res) {
  res.redirect('index.html');
});
app.get('/login', function(req, res){
  res.redirect('pagina.html');
});

};
