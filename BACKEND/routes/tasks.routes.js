const taskController = require('../controllers/tasks.controller');
const express = require('express');
const router = express.Router();
const jwtMW = require('../middleware/jwt.mw');

//GET
router.get("/", jwtMW.authenticate, taskController.getAllTasks); // Obtener todas las tareas
router.get("/:id", jwtMW.authenticate, taskController.getTaskById); // Obtener una tarea por ID

//POST
router.post("/",jwtMW.authenticate, taskController.createTask); // Crear una nueva tarea

//PATCH
router.patch("/:id", jwtMW.authenticate, taskController.updateTask); // Actualizar una tarea por ID

//DELETE
router.delete("/:id", jwtMW.authenticate, taskController.deleteTask); // Eliminar una tarea por ID

module.exports = router; // Exportar las rutas de tareas