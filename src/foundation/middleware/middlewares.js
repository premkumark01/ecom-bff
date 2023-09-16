const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const nocache = require('nocache')
const cookieParser = require('cookie-parser')
const mySQLService = require('../common/services/database-srvc')
const sixtyDaysInSeconds = 5184000

const appSecurity = (app) => {
    // Security with helmet
    app.use(helmet())
    app.use(nocache())
    app.use(helmet.frameguard())
    app.use(helmet.hsts({
        maxAge: sixtyDaysInSeconds
    }))
    //app.use(helmet.ieNoOpen())
    app.use(helmet.frameguard({
        action: 'sameorigin'
    }))
    app.use(helmet.noSniff())
    app.use(helmet.referrerPolicy({
        policy: 'same-origin'
    }))
    app.use(helmet.xssFilter())
    app.disable('x-powered-by')
}


module.exports = class Middlewares {
    static async use(app) {
        console.log('Initializing middlewares')

        if(process.env.appEnv === 'local') {
            //Use errorHandler only for development purpose
            app.use(errorhandler())
        }

        app.use(bodyParser.json())

        app.use(bodyParser.urlencoded({
            extended: true
        }))

        appSecurity(app)

        app.use(cookieParser())

        // Setup Compression
        app.use(compression())



        mySQLService.InitializeDBConnection()

    }
}