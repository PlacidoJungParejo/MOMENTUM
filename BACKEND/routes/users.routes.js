const userController = require('../controllers/users.controller');
const express = require('express');
const router = express.Router();
const jwtMW = require('../middleware/jwt.mw');
const {requireAdmin, requireUser} = require("../middleware/rutasprotegidas.mw") //middleware para comprobar si el usuario tiene permisos de administrador
//GET
router.get("/", jwtMW.authenticate, requireUser, userController.getAllUsers); // Obtener todos los usuarios
router.get("/:id", jwtMW.authenticate, requireUser, userController.getUserById); // Obtener un usuario por ID

//POST
router.post("/login", userController.loginUser); // Iniciar sesión de usuario
router.post("/logout", userController.logoutUser); // Cerrar sesión de usuario
router.post("/register", userController.registerUser); // Registrar un nuevo usuario

//PATCH
router.patch("/:id", jwtMW.authenticate, requireUser, userController.updateUser); // Actualizar un usuario por ID

//DELETE
router.delete("/:id", jwtMW.authenticate, requireAdmin, userController.deleteUser); // Eliminar un usuario por ID

module.exports = router; // Exportar las rutas de usuarios