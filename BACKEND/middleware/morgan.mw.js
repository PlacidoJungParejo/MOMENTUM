const morgan = require('morgan')
const fs = require('fs')
require('dotenv').config()
const express = require("express")
const app = express()
const ruta = process.env.LOGS_FOLDER

exports.usingMorgan = () => {
    return morgan('short',{
        stream: app.get('env') == 'development'? fs.createWriteStream(ruta+"access.log",{flags:'a'}):''
    })
}