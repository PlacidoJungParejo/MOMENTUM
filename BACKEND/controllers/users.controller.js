require("dotenv").config(); //carga las variables de entorno desde el archivo .env
const bcrypt = require("bcrypt"); //carga el módulo bcrypt para encriptar contraseñas
const userModel = require("../models/users.model"); //carga el modelo de usuario
const {wrapAsync} = require("../utils/functions"); //carga la función para manejar errores asíncronos
const jwtMW = require("../middleware/jwt.mw"); //carga el middleware para manejar tokens JWT
const AppError = require("../utils/AppError");

exports.getAllUsers = wrapAsync(async (req, res, next) => {
    await userModel.findAll(function (err, users) {
        if (err) {
            next(new AppError("Error al obtener los usuarios", 500));
        }else {
            res.status(200).json(users);
        }
    });
});

exports.getUserById = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await userModel.findById(id, function (err, user) {
        if (err) {
            next(new AppError("Error al obtener el usuario", 500));
        } else if (!user) {
            next(new AppError("Usuario no encontrado", 404));
        } else {
            res.status(200).json(user);
        }
    });
});

exports.loginUser = wrapAsync(async (req, res, next) => {
    const { usuario, contrasena } = req.body;
    await userModel.login(usuario, contrasena, function (err, user) {
        if (err) {
            next(new AppError("Error al iniciar sesión", 500));
        } else if (!user) {
            next(new AppError("Usuario o contraseña incorrectos", 401));
        } else {
            const token = jwtMW.createJWT(user); // Generar token JWT
            res.status(200).json({ user, token });
        }
    });
})

exports.logoutUser = wrapAsync(async (req, res, next) => {
    req.session.destroy()
    res.status(200).json({ message: "Sesión cerrada" });
})

exports.registerUser = wrapAsync(async (req, res, next) => {
    const { nombre, correo, usuario, contrasena } = req.body;
    const hashedPassword = await bcrypt.hash(contrasena, 10); // Encriptar la contraseña
    const newUser = {
        nombre,
        correo,
        usuario,
        contrasena: hashedPassword,
        rol: "USER",
        fecha_creacion: new Date(),
        fecha_edicion: new Date()
    };
    await userModel.create(newUser, function (err, user) {
        if (err) {
            next(new AppError("Error al registrar el usuario", 500));
        } else {
            res.status(201).json(user);
        }
    });
})

exports.updateUser = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const userData = req.body;
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password); // Encriptar la contraseña
    }
    userData.fecha_edicion = new Date(); // Actualizar la fecha de edición
    await userModel.update(id, userData, function (err, user) {
        if (err) {
            next(new AppError("Error al actualizar el usuario", 500));
        } else if (!user) {
            next(new AppError("Usuario no encontrado", 404));
        } else {
            res.status(200).json(user);
        }
    });
})

exports.deleteUser = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await userModel.delete(id, function (err, result) {
        if (err) {
            next(new AppError("Error al eliminar el usuario", 500));
        } else if (!result) {
            next(new AppError("Usuario no encontrado", 404));
        } else {
            res.status(200).json({ message: "Usuario eliminado" });
        }
    });
})