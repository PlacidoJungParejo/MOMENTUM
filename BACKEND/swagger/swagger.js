require("dotenv").config()
const { version } = require("mongoose")
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition:{
        openapi:'3.0.0',
        info:{
            title:"API MOMENTUM",
            version: process.env.API_VERSION,
            contact:{
                name: "momentum"
            },
            servers:[
                {
                    url:"http://localhost:" + process.env.PUERTO,
                    description: "Local Server"
                }
            ]
        }
    },
    apis:['./routes/*js']
}

const specs = swaggerJsdoc(options)
module.exports = specs