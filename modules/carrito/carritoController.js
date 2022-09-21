const router = require('express').Router();

const {
  saveCarritoService,
  getAllCarritoService,
  getCarritoByIdServices,
  addProcutoToCarritoService,
  eliminarCarritoService,
  deleteProductoFromCarritoSerivice
} = require('./carritoSerivices');

router.post("/", async (_, res) => {
  try {
    const carrito = {
      timesTamp: new Date(),
      productos: []
    };
    const id = await saveCarritoService({ carrito });
    if (id) return res.status(200).json({ idCarrito: id });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  };
});

// router.get("/:id?", async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (id) {
//       const carrito = await getCarritoByIdServices(id);
//       if (carrito) return res.status(200).json(carrito);
//       else return res.status(404).json({ message: "No se encontro el carrito" });
//     } else {
//       const carritos = await getAllCarritoService();
//       if (carritos) return res.status(200).json(carritos);
//       else return res.status(404).json({ message: "No se encontraron carritos" });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   };
// });


router.put('/:id/productos', async (req, res) => {
  try {
    const idCarrito = req.params.id;
    const { idProducto } = req.body;
    const carrito = await addProcutoToCarritoService(idProducto, idCarrito);
    return res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  };
});

router.delete('/:id', async (req, res) => {
  try {
    const idCarrito = req.params.id;
    const carritoEliminado = await eliminarCarritoService(idCarrito);
    return res.status(200)
      .json(carritoEliminado)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  };
});

router.delete('/:id/productos/:id_prod', async (req, res) => {
  try {
    const idCarrito = req.params.id;
    const idProducto = req.params.id_prod;

    const carrito = await deleteProductoFromCarritoSerivice(idCarrito, idProducto)
    return res.status(200)
      .json(carrito);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  const { email } = req.user
  const carritos = await getAllCarritoService();
  if (carritos) {
    const carritoUsuario = carritos.filter(car => car.emailUsuario == email);

    res.render('carritoUsuario', { carritoUsuario: carritoUsuario });
  }

});


module.exports = router;

