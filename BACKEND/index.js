//Imports de cosas externas
require("dotenv").config(); //dotenv es para cargar las variables de entorno
const methodOverride = require("method-override"); //para poder usar el método PUT y DELETE en los formularios
const express = require("express"); //express es un framework de node.js para crear aplicaciones web
const fs = require("fs"); //fs es un módulo de node.js para trabajar con el sistema de archivos
const https = require("https"); //https es un módulo de node.js para crear servidores https
const app = express(); //crea una instancia de express
const path = require("path"); //path es un módulo de node.js para trabajar con rutas de archivos
const port = process.env.PORT || 3000; //puerto por defecto 3000 o el que se le pase por variable de entorno
const cors = require("cors"); //cors es un middleware para habilitar CORS (Cross-Origin Resource Sharing)
const swaggerUi = require("swagger-ui-express"); //swagger-ui-express es un middleware para servir la documentación de la API en formato Swagger
//Imports de cosas internas
const taskRoutes = require("./routes/tasks.routes"); //rutas de las tareas
const userRoutes = require("./routes/users.routes"); //rutas de los usuarios
const specs = require("./swagger/swagger") //especificaciones de swagger
const logger = require("./utils/logger") //logger para registrar información en la consola
const { errorHandler } = require("./middleware/errorHandler.mw") //middleware para manejar errores
const AppError = require("./utils/AppError") //clase para manejar errores personalizados
const morganMW = require("./middleware/morgan.mw"); //middleware para registrar información de las peticiones HTTP

//Carga certificado y clave para HTTPS
let certificado = null
let key_certificado = null
let https_server = false
// try {
//     certificado = fs.readFileSync("tls/key.crt"); //carga el certificado
//     key_certificado = fs.readFileSync("tls/key.key"); //carga la clave del certificado
//     https_server = true
// } catch (error) {
//     console.log(error);
// }

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
};

//Rutas del servidor
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); //rutas de la documentación de la API en formato Swagger
app.use(`/api/${process.env.API}/tasks`, taskRoutes); //rutas de las tareas
app.use(`/api/${process.env.API}/users`, userRoutes); //rutas de los usuarios

//Si no se encuentra la ruta, se lanza un error 404
app.use((req, res, next) => {
    const error = new AppError("Not found", 404);
    next(error);
});

//Middleware para manejar errores
app.use(errorHandler); //middleware para manejar errores personalizados

//Inicia el servidor

if (https_server) {
    https.createServer({
        cert: certificado,
        key: key_certificate
    }, app).listen(port, () => {
        console.log(`${process.env.MENSAJE} https://localhost:${port}/api-docs`)
        console.log(`${process.env.MENSAJE} https://localhost:${port}/api/${process.env.API}/users/login`)
    })
} else {
    app.listen(port, () => {
        console.log(`${process.env.MENSAJE} http://localhost:${port}/api-docs`)
        console.log(`${process.env.MENSAJE} http://localhost:${port}/api/${process.env.API}/users/login`)
    })
}
