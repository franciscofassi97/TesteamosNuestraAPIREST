const socket = io();
const btnCerrarSession = document.getElementById("btnCerrarSession");

var productosAgregarAlCarrito = [];
const autorSchema = new normalizr.schema.Entity("autor", {}, { idAttribute: "mail" });

const mensajesSchema = new normalizr.schema.Entity("mensajes", {
  autor: autorSchema,
});


const crearProducto = (event) => {

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById('stock').value;
  const codigo = document.getElementById('codigo').value;
  const descripcion = document.getElementById('descripcion').value;
  const fotoUrl = document.getElementById("fotoUrl").value;

  const producto = { nombre, precio, stock, codigo, descripcion, fotoUrl }
  socket.emit("agregarProducto", producto);
  return false;
};

socket.on("leerProductos", async (productos) => {

  if (productos.length > 0) {
    document.getElementById("tbodyProductos").innerHTML = "";
    document.getElementById("divErrors").innerHTML = "";

    for (let i = 0; i < productos.length; i++) {
      let producto = productos[i];
      let idProdcuto = producto.id || producto._id
      let productoHTML = `
             <tr>
               <td>${producto.nombre}</td>
               <td>${producto.descripcion}</td>
               <td>${producto.codigo}</td>
               <td>${producto.precio}</td>
               <td>${producto.stock}</td>
               <td><img style="width: 50px; height:50px" src=${producto.fotoUrl} alt=""></td>
               <td><form onsubmit="return agregarAlCarrito('${idProdcuto}','${producto.nombre}','${producto.precio}')"><input type="submit" value="Comprar"></form></td>
             </tr>`;
      document.getElementById("tbodyProductos").innerHTML += productoHTML;
    }
  }
});


const agregarAlCarrito = (idProducto, nombre, precio) => {
  const producto = { idProducto, nombre, precio }
  productosAgregarAlCarrito.push(producto);
  document.getElementById("divCarrito").innerHTML = "";
  for (let i = 0; i < productosAgregarAlCarrito.length; i++) {

    const producto = productosAgregarAlCarrito[i];
    const carritoHtml = ` <label>${producto.nombre} ${producto.precio}</label> <br>`;
    document.getElementById("divCarrito").innerHTML += carritoHtml;

  };
  return false;
}

const onConfirmarCompra = () => {
  const elementUsuario = document.getElementsByClassName('emailUsuario')
  const emailUsuairo = elementUsuario[0].id;

  socket.emit("crearCarritoConProductos", productosAgregarAlCarrito, emailUsuairo);
  return false;
}

socket.on('finAgregarAlCarrito', (resultado) => {
  document.getElementById("divCarrito").innerHTML = "";
  if (!resultado) document.getElementById("divCarrito").innerHTML = `<p>Compra Realizada</p>`
  else document.getElementById("divCarrito").innerHTML = `<p>Ocurrio algun problema</p>`
});

const onMessage = () => {

  const mensaje = document.getElementById("message").value;
  const autor = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    edad: document.getElementById("edad").value,
    alias: document.getElementById("alias").value,
    avatar: document.getElementById("avatar").value,
    mail: document.getElementById("mail").value
  }
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();

  const data = { mensaje, autor, date: date + " " + time }


  // const mensaje = { mail, message, date: date + " " + time };

  console.log(mensaje);
  socket.emit("agregarMensaje", data);
  return false;
};

socket.on("leerMensajes", (mensajes) => {
  console.log('mensajes normalizados ', mensajes);
  const mensajesdesnormalizado = normalizr
    .denormalize(mensajes.result,
      [mensajesSchema],
      mensajes.entities
    );

  console.log("Mensajes desnormalizados", mensajesdesnormalizado);

  if (mensajesdesnormalizado.length > 0) {
    document.getElementById("messagesDiv").innerHTML = "";
    document.getElementById("porcentajeDiv").innerHTML = "";

    for (let i = 0; i < mensajesdesnormalizado.length; i++) {
      let mensajeFor = mensajesdesnormalizado[i]._doc || mensajesdesnormalizado[i];
      console.log('Mensaje en ciclo for', mensajeFor);
      let mensajeHTML = `
      <p><spam><strong>${mensajeFor.autor.mail}</strong> </spam>
      <spam class="date">${mensajeFor.date} </spam> :
      <spam class="message">${mensajeFor.mensaje}</spam></p>
      `;
      document.getElementById("messagesDiv").innerHTML += mensajeHTML;
    }
    let porcentajeHtml = `
      <p>${(((JSON.stringify(mensajes).length) * 100) / JSON.stringify(mensajesdesnormalizado).length).toFixed(2)} %</p>
     `
    document.getElementById("porcentajeDiv").innerHTML += porcentajeHtml;
  } else {
    document.getElementById("messagesDiv").innerHTML =
      "<h1>No hay Mensajes</h1>";
  }
});

