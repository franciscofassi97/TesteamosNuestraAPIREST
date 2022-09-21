const mongoose = require('mongoose');

const productosSchema = new mongoose.Schema(
  {
    nombre: { type: String },
    descripcion: { type: String },
    codigo: { type: String },
    fotoUrl: { type: String },
    precio: { type: Number },
    stock: { type: Number },
  },
  { timestamps: true }
);

const Productos = mongoose.model("productos", productosSchema);


module.exports = Productos;