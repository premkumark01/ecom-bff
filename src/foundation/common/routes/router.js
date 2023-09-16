const fs = require('fs')
const path = require('path')
const express = require('express')

class Router {
    constructor() {
        this.startFolder = null
    }

    //Called once during initial server startup
    load(app, folderName) {

        if (!this.startFolder) {
            this.startFolder = path.basename(folderName)
        }

        fs.readdirSync(folderName).forEach((file) => {
            const fullName = path.join(folderName, file)
            const stat = fs.lstatSync(fullName)

            if (stat.isDirectory()) {
                //Recursively walk-through folders
                this.load(app, fullName)
            } else if (file.toLowerCase().indexOf('.js')) {
                //Grap path to JavaScript file and use it to construct the route
                const dirs = path.dirname(fullName).split(path.sep)

                if (dirs[2].toLowerCase() === this.startFolder.toLowerCase()) {
                    dirs.splice(0, 3)
                }

                const router = express.Router()
                const baseRoute = `/${dirs.join('/')}`

                console.log(`Created route: ${baseRoute} for ${fullName}`)

                //Load the Javascript file ('controller') and pass the router to it
                const controllerClass = require(`../../../../${fullName}`)
                new controllerClass(router)

                //Associate the route with the router
                app.use(baseRoute, router)
            }
        })
    }
}

module.exports = new Router()