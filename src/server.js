const express = require('express')
const ProcessListener = require('./foundation/common/listeners/process-event-listener')
const Middlewares = require('./foundation/middleware/middlewares')
const Router = require('./foundation/common/routes/router')
const configLoader = require('./foundation/common/utilities/config-loader')


const app = module.exports = express()
let port = 80

/**
 * Step 1: Listen to process events
 */
ProcessListener.listen(app)

class Server {

    static async run(app) {

        /**
         * Step 1: load Connfiguration
         */
        await configLoader.load()
        port = process.env.PORT || 80
        /**
         * Step 2: Initializing Middlewares
        */
        await Middlewares.use(app)

        /**
         * Step 3: 
        */
        Router.load(app, './src/app/controllers')

        /**
         * Step 4: Start the Server
        */
        app.listen(port, (err) => {
            if (err) {
                console.log({ err })
            }
            console.log(`${process.env.Node_ENV} Listening on http://localhost:${port}`)
        })
    }
}

/**
 * Step 2: Start the application
 */
Server.run(app).catch((err) => console.log(err))
