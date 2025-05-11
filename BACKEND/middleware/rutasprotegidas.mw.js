const AppError = require("../utils/AppError")

const checkProfile = (req,profileParam) => {
    console.log("checkProfile",req.session);
    
    if(req.session && 
        req.session.userLogued &&
        req.session.userLogued.data &&
        req.session.userLogued.data.rol &&
        req.session.userLogued.data.rol == profileParam
    ){
        return true
    }else{
        return false
    }
}

exports.requireAdmin = (req,res,next) => {
    if(checkProfile(req,"ADMIN") || checkProfile(req,"SUPERADMIN")){
        next()
    }else{
        next(new AppError("No estás autorizado", 403)) //Forbidden
    }
}

exports.requireUser = (req,res,next) => {
    if(checkProfile(req,"USER") || checkProfile(req,"ADMIN") || checkProfile(req,"SUPERADMIN")){
        next()
    }else{
        next(new AppError("No estás autorizado", 403)) //Forbidden
    }
}