const definirContenedor = require('../daos');

const dalSaveCarrito = async (carrito) => {
  const contenedor = await definirContenedor('Carritos');
  const newCarrito = await contenedor.save(carrito);
  return newCarrito;

};

const dalGetAllCarrito = async () => {
  const contenedor = await definirContenedor('Carritos');
  const carritos = await contenedor.getAllData();
  return carritos;
};

const dalGetCarritoById = async (id) => {
  const contenedor = await definirContenedor('Carritos');
  const carrito = await contenedor.getById(id);
  return carrito
};

const dalAddProcutoToCarrito = async (idProducto, idCarrito) => {
  const contenedor = await definirContenedor('Carritos');
  const contenedorProductos = await definirContenedor('Productos');

  const carrito = await contenedor.getById(idCarrito);
  const producto = await contenedorProductos.getById(idProducto);
  if (carrito && producto) {
    carrito.productos.push(producto);
    const carritoToUpdate = await contenedor.upDate(idCarrito, carrito);
    return carritoToUpdate.id;
  };
};

const dalEliminarCarrito = async (idCarrito) => {
  const contenedor = await definirContenedor('Carritos');
  const carrito = await contenedor.getById(idCarrito);
  if (carrito) {
    const carritoEliminado = await contenedor.deleteById(idCarrito);
    return carritoEliminado;
  };
};

const dalDeleteProductoByIdFormCarrito = async (idCarrito, idProducto) => {
  const contenedor = await definirContenedor('Carritos');
  let carrito = await contenedor.getById(idCarrito);

  const index = carrito.productos.findIndex(obj => (obj._id || obj.id) == idProducto);

  const productDeleted = carrito.productos.splice(index, 1);

  if (productDeleted) {
    const carritoUpdated = await contenedor.upDate(idCarrito, carrito);
    return carritoUpdated
  };
};


module.exports = {
  dalSaveCarrito,
  dalGetAllCarrito,
  dalGetCarritoById,
  dalAddProcutoToCarrito,
  dalEliminarCarrito,
  dalDeleteProductoByIdFormCarrito
};
