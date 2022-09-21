const { ACCOUNT_SID, TOKEN, TWILIO_NUMBER_TO, TWILIO_NUMBER_FROM } = require('../config')

const twilio = require('twilio')

const clinte = twilio(ACCOUNT_SID, TOKEN)

const enviarMensajeDeWhatsApp = () => {
  clinte.messages.create({
    to: TWILIO_NUMBER_TO,
    from: TWILIO_NUMBER_FROM,
    body: 'Se recibio su pedido exitosamente, esta siendo procesesado'
  }).then(data => {
    console.log("mensaje enviado correctamente")
  }).catch(console.log)
}

module.exports = { enviarMensajeDeWhatsApp }