const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema(
  {
    productos: { type: Array },
    emailUsuario: { type: String },
    timestamp: { type: Date },
  },
  { timestamps: true }
);

const Carrito = mongoose.model('carrito', carritoSchema);

module.exports = Carrito;