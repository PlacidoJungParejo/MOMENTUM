require("dotenv").config();
const taskModel = require("../models/tasks.model"); //carga el modelo de tareas
const { wrapAsync } = require("../utils/functions"); //carga la función para manejar errores asíncronos
const AppError = require("../utils/AppError"); //carga la clase de error personalizado

exports.getAllTasks = wrapAsync(async (req, res, next) => {
    await taskModel.findAll(function (err, tasks) {
        if (err) {
            next(new AppError("Error al obtener las tareas", 500));
        } else {
            res.status(200).json(tasks);
        }
    });
});

exports.getTaskById = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await taskModel.findById(id, function (err, task) {
        if (err) {
            next(new AppError("Error al obtener la tarea", 500));
        } else if (!task) {
            next(new AppError("Tarea no encontrada", 404));
        } else {
            res.status(200).json(task);
        }
    });
});

exports.createTask = wrapAsync(async (req, res, next) => {
    const taskData = req.body;
    const { titulo, descripcion, estado, prioridad, id_creador } = taskData;

    // Validar campos obligatorios
    if (!titulo || !descripcion || !estado || !prioridad || !id_creador) {
        return next(new AppError('Faltan campos obligatorios: titulo, descripcion, estado, prioridad, id_creador', 400));
    }

    const newTask = {
        titulo,
        descripcion,
        estado: estado || "PENDIENTE",
        prioridad: prioridad || "BAJA",
        fecha_creacion: new Date(),
        fecha_finalizacion: taskData.fecha_finalizacion || null,
        fecha_edicion: new Date(),
        id_creador,
        lista_id: taskData.lista_id || null,
        etiquetas: taskData.etiquetas || []
    };

    console.log('Datos enviados al modelo:', newTask);
    await taskModel.create(newTask, function (err, task) {
        if (err) {
            console.error('Error en taskModel.create:', err);
            return next(new AppError(`Error al crear la tarea: ${err.message}`, 500));
        }
        res.status(201).json(task);
    });
});

exports.updateTask = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const taskData = req.body;
    const updatedTask = {
        titulo: taskData.titulo,
        descripcion: taskData.descripcion,
        estado: taskData.estado || "PENDIENTE",
        prioridad: taskData.prioridad || "BAJA",
        fecha_finalizacion: taskData.fecha_finalizacion || null,
        fecha_edicion: new Date(),
        id_creador: taskData.id_creador || null,
        lista_id: taskData.lista_id || null,
        etiquetas: taskData.etiquetas || []
    };
    await taskModel.update(id, updatedTask, function (err, task) {
        if (err) {
            next(new AppError("Error al actualizar la tarea", 500));
        } else if (!task) {
            next(new AppError("Tarea no encontrada", 404));
        } else {
            res.status(200).json(task);
        }
    });
});

exports.deleteTask = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await taskModel.delete(id, function (err, result) {
        if (err) {
            next(new AppError("Error al eliminar la tarea", 500));
        } else if (!result) {
            next(new AppError("Tarea no encontrada", 404));
        } else {
            res.status(200).json({ message: "Tarea eliminada" });
        }
    });
});
