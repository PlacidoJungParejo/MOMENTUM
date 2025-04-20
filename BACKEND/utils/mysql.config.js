require("dotenv").config()//Importa y configura las variables de entorno

const dbConn = {
    host:process.env.MYSQL_HOST,
    port:process.env.MYSQL_PORT,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASS,
    database:process.env.MYSQL_DATABASE
}

module.exports = dbConn//Exportamos la conexion con MySQL