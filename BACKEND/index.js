//Imports de cosas externas
require("dotenv").config(); //dotenv es para cargar las variables de entorno
const methodOverride = require("method-override"); //para poder usar el método PUT y DELETE en los formularios
const express = require("express"); //express es un framework de node.js para crear aplicaciones web
const session = require("express-session"); //express-session es un middleware para manejar sesiones
const app = express(); //crea una instancia de express
const path = require("path"); //path es un módulo de node.js para trabajar con rutas de archivos
const port = process.env.PORT || 3000; //puerto por defecto 3000 o el que se le pase por variable de entorno
const swaggerUi = require("swagger-ui-express"); //swagger-ui-express es un middleware para servir la documentación de la API en formato Swagger
const cors = require('cors'); //importar cors
//Imports de cosas internas
const taskRoutes = require("./routes/tasks.routes"); //rutas de las tareas
const userRoutes = require("./routes/users.routes"); //rutas de los usuarios
const specs = require("./swagger/swagger") //especificaciones de swagger
const logger = require("./utils/logger") //logger para registrar información en la consola
const { errorHandler } = require("./middleware/errorHandler.mw") //middleware para manejar errores
const AppError = require("./utils/AppError") //clase para manejar errores personalizados
const morganMW = require("./middleware/morgan.mw"); //middleware para registrar información de las peticiones HTTP

//Configuracion de servidor
app.use(methodOverride("_method")); //middleware para poder usar el método PUT y DELETE en los formularios
app.set("views", path.join(__dirname, "views")); //configura la carpeta de vistas
app.set("view engine", "ejs"); //configura el motor de plantillas EJS
app.use(express.json()); //middleware para parsear el cuerpo de las peticiones JSON
app.use(express.urlencoded({ extended: true })); //middleware para parsear el cuerpo de las peticiones URL-encoded

app.use((req, res, next) => { //middleware para definir variables globales
    res.locals.BaseURL = '/api/${process.env.API}'
    next()
})

//Configuracion de CORS
const whiteList = ['http://localhost:3000', 'http://localhost:5173'] //lista blanca de dominios permitidos

const corsOptions = {
    origin: function (origin, callback) { //función para comprobar si el origen de la petición está en la lista blanca
        if (!origin || whiteList.includes(origin)) { //si no hay origen o el origen está en la lista blanca
            callback(null, true); //permite el origen
        } else {
            callback(new AppError("No permitido", 403), false); //si no está en la lista blanca, lanza un error 403
        }
    },
    credentials: true, //permite el uso de cookies
};

// Aplicar configuración CORS
app.use(cors(corsOptions));

//Morgan y sesion
app.use(morganMW.usingMorgan()); //middleware para registrar información de las peticiones HTTP
app.use(session({
    secret:process.env.SESSION_SECRET,//Firmar el SID, para generar el código y que no sea manipulado
    resave:false,//No se guardará en el store si no ha cambiado
    saveUninitialized:false,//No se guardará en el store hasta que no se inicialice de alguna forma
    cookie:{
        secure:false,
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite:"none" //Permite envío de cookies en solicitudes entre diferentes dominios (CORS habilitado), pero requiere secure:true
    }    
}))

//Rutas del servidor

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); //rutas de la documentación de la API en formato Swagger
app.use(`/api/${process.env.API}/tasks`, taskRoutes); //rutas de las tareas
app.use(`/api/${process.env.API}/users`, userRoutes); //rutas de los usuarios

//Si no se encuentra la ruta, se lanza un error 404
app.use((req, res, next) => {
    logger.error.fatal("Ruta no existente " + req.originalUrl)
    throw new AppError("Ruta no existente", 404) //NOT FOUND
});

//Middleware para manejar errores
app.use(errorHandler); //middleware para manejar errores personalizados

//Inicia el servidor

app.listen(port, () => {
    console.log(`${process.env.MENSAJE} http://localhost:${port}/api-docs`)
    console.log(`${process.env.MENSAJE} http://localhost:${port}/api/${process.env.API}/users/login`)
})