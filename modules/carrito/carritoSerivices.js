
const {
  dalSaveCarrito,
  dalGetAllCarrito,
  dalGetCarritoById,
  dalAddProcutoToCarrito,
  dalEliminarCarrito,
  dalDeleteProductoByIdFormCarrito
} = require('./carritoDal');

const saveCarritoService = async (carrito) => {
  if (!carrito) throw new Error('Error al crear un carrito nuevo');
  const newCarrito = await dalSaveCarrito(carrito);
  return newCarrito;
};

const getAllCarritoService = async () => {
  const carritos = await dalGetAllCarrito();
  return carritos;
};

const getCarritoByIdServices = async (id) => {
  const carrito = await dalGetCarritoById(id);
  return carrito;
};

const addProcutoToCarritoService = async (idProducto, idCarrito) => {
  const carrito = await dalAddProcutoToCarrito(idProducto, idCarrito);
  return carrito;
};

const eliminarCarritoService = async (idCarrito) => {
  const carritoElminado = await dalEliminarCarrito(idCarrito);
  return carritoElminado;
};

const deleteProductoFromCarritoSerivice = async (idCarrito, idProducto) => {
  const carrito = await dalDeleteProductoByIdFormCarrito(idCarrito, idProducto);
  return carrito;
};

module.exports = {
  saveCarritoService,
  getAllCarritoService,
  getCarritoByIdServices,
  addProcutoToCarritoService,
  eliminarCarritoService,
  deleteProductoFromCarritoSerivice
};

