const { getAllProductosService, agregarProductoService } = require('../modules/productos/productosServices');
const { saveCarritoService, addProcutoToCarritoService } = require('../modules/carrito/carritoSerivices');
const { sendEmailCompraRealizada } = require('../nodemailer/nodemailer');
const { enviarMensajeDeWhatsApp } = require('../twilio/twilio');

module.exports = (server) => {
  const { Server: IoServer } = require("socket.io");
  const ioSocket = new IoServer(server);

  ioSocket.on("connection", async (socket) => {
    console.log("New cliente connected");



    //Emitit eventos de sockets para visualizacion de datos en el cliente
    const listProductos = await getAllProductosService()
    socket.emit("leerProductos", listProductos);


    //Prodcutos
    socket.on("agregarProducto", async (producto) => {
      const idProducto = await agregarProductoService(producto);
      if (idProducto) ioSocket.sockets.emit("leerProductos", await getAllProductosService());
    });

    socket.on("crearCarritoConProductos", async (arrayProductos, emailUsuario) => {
      let error = false;

      const carrito = {
        timesTamp: new Date(),
        productos: [],
        emailUsuario: emailUsuario
      };
      const idCarrito = await saveCarritoService(carrito)

      for (let i = 0; i < arrayProductos.length; i++) {
        const producto = arrayProductos[i];
        const productoAgregadoAlCarrito = await addProcutoToCarritoService(producto.idProducto, idCarrito)
        console.log(productoAgregadoAlCarrito);
        if (!productoAgregadoAlCarrito) return error = true;
      };

      enviarMensajeDeWhatsApp()
      sendEmailCompraRealizada(arrayProductos, emailUsuario)
      socket.emit("finAgregarAlCarrito", error);

    });
  });
};