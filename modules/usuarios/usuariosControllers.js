const router = require('express').Router();
const uploads = require("../../utils/multer/uploads");
const {
  createUsuarioService,
  getUsurioByEmailService
} = require('./usuariosServices')

const passport = require('passport');

router.post('/registro', uploads.single('fotoUrl'), async (req, res, next) => {
  try {
    const { email, password, nombre, direccion, edad, numeroTelefono } = req.body;
    const file = req.file;
    if (file) {
      const user = await getUsurioByEmailService(email);
      if (user) res.redirect('/registro/error')
      const newUser = await createUsuarioService({
        email,
        password,
        nombre,
        direccion,
        edad,
        numeroTelefono,
        fotoUrl: file.path
      });
      if (newUser) next();
    };
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}, passport.authenticate('iniciarSesion'), (req, res) => {
  const { email } = req.user
  const host = req.headers.host
  res.redirect('/api/productos')
  // res.render('formProducts', { nombreUsuario: nombre, host: host });
});



router.post('/iniciarSesion', passport.authenticate(
  'iniciarSesion',
  {
    failureRedirect: '/api/usuarios/iniciarSesion/error',
    failureMessage: true
  },
), (req, res) => {

  res.redirect('/api/productos')
});

//Vistas 
//Registro
router.get('/registro', (_, res) => {
  res.render('registroForm');
});

router.get('/registro/error', (_, res) => {
  res.render("registroForm", { error: "El usuario ya existe" });
});

//Iniciar Sesion
router.get('/iniciarSesion', (_, res) => {
  res.render('iniciarSesionForm');
});


router.get('/iniciarSesion/error', (_, res) => {
  res.render("iniciarSesionForm", { error: "Usurio o contrasena incorrecta" });
})

router.get('/cerrarSesion', (req, res) => {
  const nombreUsuario = req.user.email;
  req.logout(function (err) {
    if (err) { return next(err); }
    res.render('adios', { nombreUsuario })
    res.set({ 'Refresh': '3; url=/api/productos' });
  });
});


module.exports = router;