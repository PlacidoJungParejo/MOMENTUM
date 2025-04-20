const dbConn = require('../utils/mysql.config'); // Cargar la configuración de conexión a la base de datos
const mysql = require('mysql')

let users = function (user) { // Constructor de usuario
    this.nombre = user.nombre, // VARCHAR(100), NOT NULL
    this.correo = user.correo, // VARCHAR(100), NOT NULL, UNIQUE
    this.usuario = user.usuario, // VARCHAR(50), NOT NULL, UNIQUE
    this.contrasena = user.contrasena, // VARCHAR(255), NOT NULL
    this.rol = user.rol || "USUARIO", // VARCHAR(50), NOT NULL
    this.fecha_creacion = user.fecha_creacion || new Date(), // Default CURRENT_TIMESTAMP
    this.fecha_edicion = new Date() // Default CURRENT_TIMESTAMP
}

users.findAll = function (result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ');
            const sql = 'SELECT * FROM usuario'; // Consulta SQL para obtener todas las tareas
            connection.query(sql, function (err, datos) { // Ejecuta la query
                if (err) { // Si hay error
                    result(err, null) //Envia el error sin los datos
                } else { //Si no hay error
                    result(null, datos) //Envia los datos sin el error
                }
            })

            connection.end((err) => { // Cierra la conexión
                if (err) { // Si hay un error
                    console.log("Error al desconectar de MySQL. Desc: " + err) //Hace un console log de error
                    return
                } else { //Si no hay un error
                    console.log("Conexión MySQL cerrada") //Hace un console log de que se ha cerrado la conexion
                }
            })
        }
    });
};

users.findById = function (id, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ' );
            const sql = 'SELECT * FROM usuario WHERE id = ?'; // Consulta SQL para obtener una tarea por su id
            connection.query(sql, id, function (err, datos) { // Ejecuta la query
                if (err) { // Si hay error
                    result(err, null) //Envia el error sin los datos
                } else { //Si no hay error
                    result(null, datos) //Envia los datos sin el error
                }
            })

            connection.end((err) => { // Cierra la conexión
                if (err) { // Si hay un error
                    console.log("Error al desconectar de MySQL. Desc: " + err) //Hace un console log de error
                    return
                } else { //Si no hay un error
                    console.log("Conexión MySQL cerrada") //Hace un console log de que se ha cerrado la conexion
                }
            })
        }
    });
};

users.create = function (newUser, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ' );
            const sql = 'INSERT INTO usuario SET ?'; // Consulta SQL para insertar un nuevo usuario
            connection.query(sql, newUser, function (err, datos) { // Ejecuta la query
                if (err) { // Si hay error
                    result(err, null) //Envia el error sin los datos
                } else { //Si no hay error
                    result(null, datos) //Envia los datos sin el error
                }
            })

            connection.end((err) => { // Cierra la conexión
                if (err) { // Si hay un error
                    console.log("Error al desconectar de MySQL. Desc: " + err) //Hace un console log de error
                    return
                } else { //Si no hay un error
                    console.log("Conexión MySQL cerrada") //Hace un console log de que se ha cerrado la conexion
                }
            })
        }
    });
};

users.login = function (usuario, contrasena, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ' );
            const sql = 'SELECT * FROM usuario WHERE usuario = ? AND contrasena = ?'; // Consulta SQL para obtener un usuario por su nombre y contraseña
            connection.query(sql, [usuario, contrasena], function (err, datos) { // Ejecuta la query
                if (err) { // Si hay error
                    result(err, null) //Envia el error sin los datos
                } else { //Si no hay error
                    result(null, datos) //Envia los datos sin el error
                }
            })

            connection.end((err) => { // Cierra la conexión
                if (err) { // Si hay un error
                    console.log("Error al desconectar de MySQL. Desc: " + err) //Hace un console log de error
                    return
                } else { //Si no hay un error
                    console.log("Conexión MySQL cerrada") //Hace un console log de que se ha cerrado la conexion
                }
            })
        }
    });
};

users.update = function (id, user, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ' );
            const sql = 'UPDATE usuario SET ? WHERE id = ?'; // Consulta SQL para actualizar un usuario por su id
            connection.query(sql, [user, id], function (err, datos) { // Ejecuta la query
                if (err) { // Si hay error
                    result(err, null) //Envia el error sin los datos
                } else { //Si no hay error
                    result(null, datos) //Envia los datos sin el error
                }
            })

            connection.end((err) => { // Cierra la conexión
                if (err) { // Si hay un error
                    console.log("Error al desconectar de MySQL. Desc: " + err) //Hace un console log de error
                    return
                } else { //Si no hay un error
                    console.log("Conexión MySQL cerrada") //Hace un console log de que se ha cerrado la conexion
                }
            })
        }
    });
};

users.delete = function (id, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ' );
            const sql = 'DELETE FROM usuario WHERE id = ?'; // Consulta SQL para eliminar un usuario por su id
            connection.query(sql, id, function (err, datos) { // Ejecuta la query
                if (err) { // Si hay error
                    result(err, null) //Envia el error sin los datos
                } else { //Si no hay error
                    result(null, datos) //Envia los datos sin el error
                }
            })

            connection.end((err) => { // Cierra la conexión
                if (err) { // Si hay un error
                    console.log("Error al desconectar de MySQL. Desc: " + err) //Hace un console log de error
                    return
                } else { //Si no hay un error
                    console.log("Conexión MySQL cerrada") //Hace un console log de que se ha cerrado la conexion
                }
            })
        }
    });
};

module.exports = users;
