const AppError = require("../utils/AppError")

const checkProfile = (req,profileParam) => {
    if(req.session && 
        req.session.userLogued &&
        req.session.userLogued.data &&
        req.session.userLogued.data.profile &&
        req.session.userLogued.data.profile == profileParam
    ){
        return true
    }else{
        return false
    }
}

exports.requireAdmin = (req,res,next) => {
    if(checkProfile(req,"ADMIN")){
        next()
    }else{
        next(new AppError("No estás autorizado", 403)) //Forbidden
    }
}

exports.requireUser = (req,res,next) => {
    if(checkProfile(req,"USER")){
        next()
    }else{
        next(new AppError("No estás autorizado", 403)) //Forbidden
    }
}