require("dotenv").config(); //carga las variables de entorno desde el archivo .env
const bcrypt = require("bcrypt"); //carga el módulo bcrypt para encriptar contraseñas
const userModel = require("../models/users.model"); //carga el modelo de usuario
const {wrapAsync} = require("../utils/functions"); //carga la función para manejar errores asíncronos
const jwtMW = require("../middleware/jwt.mw"); //carga el middleware para manejar tokens JWT
const AppError = require("../utils/AppError");

//Funciones utiles
function validarContrasena(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

//Exports
exports.registerUser = wrapAsync(async (req, res, next) => { // Crea un nuevo usuario
    const userData = req.body;
    if (!validarContrasena(userData.contrasena)) {
        return next(new AppError("La contraseña no cumple con los requisitos (mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial)", 400));
    }
    const hashedPassword = await bcrypt.hash(userData.contrasena, 10); // Encriptar la contraseña
    const newUser = {
        nombre: userData.nombre,
        correo: userData.correo,
        usuario: userData.usuario,
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

exports.loginUser = wrapAsync(async (req, res, next) => {
    try {
        const { usuario, contrasena } = req.body;

        if (!usuario || !contrasena) {
            return next(new AppError("Usuario y contraseña son requeridos", 400));
        }

        await userModel.login(usuario, async function (err, userFound) {
            if (err) {
                return next(new AppError(err, 400));
            }

            if (!userFound) {
                return next(new AppError("Usuario y/o contraseña incorrectos", 401));
            }

            if (!userFound.contrasena) {
                return next(new AppError("Error en los datos del usuario", 500));
            }

            try {
                const validado = await bcrypt.compare(contrasena, userFound.contrasena);

                if (validado) {
                    const jwtToken = jwtMW.createJWT(userFound);
                    
                    const userLogued = {
                        data: userFound,
                        token: jwtToken
                    };

                    req.session.userLogued = userLogued;
                    res.status(200).json(userLogued);
                } else {
                    return next(new AppError("Usuario y/o contraseña incorrectos", 401));
                }
            } catch (error) {
                return next(new AppError("Error en la validación de la contraseña", 500));
            }
        });
    } catch (error) {
        return next(new AppError(error.message || "Error en la autenticación", 500));
    }
});

exports.logoutUser = wrapAsync(async (req, res, next) => {
    req.session.destroy()
    res.status(200).json({ message: "Sesión cerrada" });
})