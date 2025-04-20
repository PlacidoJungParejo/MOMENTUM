const dbConn = require('../utils/mysql.config'); // Cargar la configuración de conexión a la base de datos
const mysql = require('mysql')

let tasks = function (task) { // Constructor de tarea
    this.titulo = task.titulo, // VARCHAR(100), NOT NULL
    this.descripcion = task.descripcion, // TEXT, NOT NULL
    this.estado = task.estado, // VARCHAR(50), NOT NULL
    this.prioridad = task.prioridad, // VARCHAR(50), NOT NULL
    this.fecha_creacion = task.fecha_creacion || new Date(), // Default CURRENT_TIMESTAMP
    this.fecha_finalizacion = task.fecha_finalizacion || null, // DATE
    this.fecha_edicion = new Date(), // Default CURRENT_TIMESTAMP
    this.id_creador = task.id_creador, // INT, NOT NULL, FOREIGN KEY (id_creador) REFERENCES usuarios(id_usuario)
    this.lista_id = task.lista_id || null, // INT, FOREIGN KEY (lista_id) REFERENCES usuarios(id_usuario)
    this.etiquetas = task.etiquetas || null // JSON
}

tasks.findAll = async function (result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ');
            const sql = 'SELECT * FROM tareas'; // Consulta SQL para obtener todas las tareas
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
}

tasks.findById = async function (id, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ' );
            const sql = 'SELECT * FROM tareas WHERE id = ?'; // Consulta SQL para obtener una tarea por su id
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
}

tasks.create = async function (newTask, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return result(err, null);
        }
        console.log('Connected to database');
        // Asegurar que etiquetas sea una cadena JSON válida
        const taskToInsert = {
            ...newTask,
            etiquetas: JSON.stringify(newTask.etiquetas || []) || '[]'
        };
        console.log('Datos para inserción:', taskToInsert);
        const sql = 'INSERT INTO tareas SET ?';
        connection.query(sql, taskToInsert, function (err, datos) {
            if (err) {
                console.error('Error en query:', err);
                console.log('Consulta SQL generada:', connection.format(sql, taskToInsert));
                result(err, null);
            } else {
                result(null, { id: datos.insertId, ...newTask });
            }
        });
        connection.end((err) => {
            if (err) console.log("Error al desconectar de MySQL: " + err);
            else console.log("Conexión MySQL cerrada");
        });
    });
};

tasks.update = async function (id, task, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return result(err, null);
        }
        console.log('Connected to database');
        const taskToUpdate = {
            ...task,
            etiquetas: JSON.stringify(task.etiquetas || []) || '[]'
        };
        console.log('Datos para actualización:', taskToUpdate);
        const sql = 'UPDATE tareas SET ? WHERE id = ?';
        connection.query(sql, [taskToUpdate, id], function (err, datos) {
            if (err) {
                console.error('Error en query:', err);
                console.log('Consulta SQL generada:', connection.format(sql, [taskToUpdate, id]));
                result(err, null);
            } else {
                result(null, datos);
            }
        });
        connection.end((err) => {
            if (err) console.log("Error al desconectar de MySQL: " + err);
            else console.log("Conexión MySQL cerrada");
        });
    });
};

tasks.delete = async function (id, result) {
    let connection = mysql.createConnection(dbConn);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }else {
            console.log('Connected to database as id ' );
            const sql = 'DELETE FROM tareas WHERE id = ?'; // Consulta SQL para eliminar una tarea
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
}

module.exports = tasks;