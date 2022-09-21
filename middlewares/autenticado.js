const estaAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/api/usuarios/iniciarSesion");
}


module.exports = { estaAutenticado };