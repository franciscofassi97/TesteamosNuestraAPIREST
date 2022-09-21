const nodemailer = require('nodemailer');
const { PASS, MAIL } = require('../config')

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL,
    pass: PASS
  }
});

const sendEmailOnRegistro = () => {
  transport.sendMail({
    from: "Nuevo registro de Usuario",
    to: MAIL,
    text: 'Se registro un usuario',
    subject: 'Usuario registrado'
  }).then((result) => {
    console.log(result)
  }).catch(error => console.log(error));
};


const sendEmailCompraRealizada = (listaProductos, nombreUsuario) => {

  let textToSend;
  for (let i = 0; i < listaProductos.length; i++) {
    console.log(listaProductos)
    const producto = listaProductos[i];
    textToSend += producto.nombre, producto.precio
  }

  transport.sendMail({
    from: "E-commerce",
    to: MAIL,
    text: textToSend,
    subject: `Nueva pedido de ${nombreUsuario}`
  }).then((result) => {
    console.log(result)
  }).catch(error => console.log(error));
};


module.exports = { sendEmailOnRegistro, sendEmailCompraRealizada }