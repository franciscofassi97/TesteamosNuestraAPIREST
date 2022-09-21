const { PORT, URL_MONGO } = require('./config')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const express = require('express');

const cluster = require('cluster');
const os = require('os');
const { MODOFORK } = require('./config')

const numeroCpu = os.cpus().length;
const processID = process.pid;


const app = express();
// const connectDB = require('./config/mongo');
// connectDB();

//Inicio servidor le paso app para sockets
const { Server: HttpServer } = require('http');
const httpServer = new HttpServer(app);

//Incio sockets
const io = require('./sockets/sockets');
io(httpServer);

//Session
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

//Midllewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  store: new MongoStore({
    mongoUrl: URL_MONGO,
  }),
  secret: "algunSecreto",
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000,  //10 minutos 
  }
}));

//Passport 
const passport = require('./utils/auth/passport')
app.use(passport.initialize())
app.use(passport.session())



const routerProductos = require('./modules/productos/productosController');
const routerCarritos = require('./modules/carrito/carritoController');
const routerUsuarios = require('./modules/usuarios/usuariosControllers');



/*-----------------Inicio Configuracion de handlebars------------------*/
const { engine } = require('express-handlebars');


app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
/*-----------------FIN Configuracion de handlebars------------------*/

app.use("/api/productos", routerProductos);
app.use('/api/carrito', routerCarritos);
app.use('/api/usuarios', routerUsuarios);




// app.listen(PORT, () => {
//   console.log(`Server corriendo en servidor ${PORT}`)
// });

if (MODOFORK) {

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

} else {
  console.log(`Procesos: ${processID}, - isMaster: ${cluster.isMaster}, - numeroCpu: ${numeroCpu}`);
  if (cluster.isPrimary) {
    for (let i = 0; i < numeroCpu; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker) => {
      console.log(`Proceso ${worker.process.pid} terminado`);
    })
  } else {
    httpServer.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
  }
}

