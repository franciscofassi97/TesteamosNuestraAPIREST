const ContenedorMongo = require("../../contenedores/ContenedorMongo");
const Usuarios = require('../../usuarios/usuariosModel');

class ContenedorUsuriosMongo extends ContenedorMongo {
  constructor(schema) {
    super(schema);
  }
}

const contenedorUsuarioMongo = new ContenedorUsuriosMongo(Usuarios);

module.exports = contenedorUsuarioMongo;