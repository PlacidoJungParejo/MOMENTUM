require("dotenv").config()
const jwt = require("jsonwebtoken") //npm i jsonwebtoken
const AppError = require("../utils/AppError")

function extractToken(req){
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === "Bearer"){
        return req.headers.authorization.split(' ')[1]
    }else if (req.query && req.query.token){
        return req.query.token
    }else if (req.session && req.session.userLogued && req.session.userLogued.token){
        return req.session.userLogued.token
    }else{
        return null
    }
}

exports.authenticate = (req,res,next) => {
    const token = extractToken(req)
    if(token){
        jwt.verify(token, process.env.SECRET_JWT, (err,decoded)=>{
            if(err){
                next(new AppError("Token inválida",401))
            }else{
                req.user = decoded.userData; // Guardar datos en req.user
                console.log(req.user)
                next()
            }
        })
    }else{
        next(new AppError("Debes iniciar sesión", 401))
    }
}

exports.createJWT = (userData) => {
    try {
        const payload = { userData };
        const token = jwt.sign(payload, process.env.SECRET_JWT, {
            expiresIn: '30m'
        });
        console.log(token);
        return token;
    } catch (error) {
        throw new AppError(error.message, 500); // Usa throw en lugar de next
    }
};

exports.destroyJWT = (req) => {
    const result = jwt.sign(req.session.userLogued.token,"", {expiresIn:1},(logout,err) => {
        return true
    })   
}