const taskController = require('../controllers/tasks.controller');
const express = require('express');
const router = express.Router();
const jwtMW = require('../middleware/jwt.mw');
const { requireUser } = require("../middleware/rutasprotegidas.mw") //middleware para comprobar si el usuario tiene permisos de administrador

//GET
router.get("/", jwtMW.authenticate, requireUser, taskController.getAllTasks); // Obtener todas las tareas
router.get("/:id", jwtMW.authenticate, requireUser, taskController.getTaskById); // Obtener una tarea por ID

//POST
router.post("/", jwtMW.authenticate, requireUser, taskController.createTask); // Crear una nueva tarea

//PATCH
router.patch("/:id", jwtMW.authenticate, requireUser, taskController.updateTask); // Actualizar una tarea por ID

//DELETE
router.delete("/:id", jwtMW.authenticate, requireUser, taskController.deleteTask); // Eliminar una tarea por ID (solo el usuario propietario)

module.exports = router; // Exportar las rutas de tareas