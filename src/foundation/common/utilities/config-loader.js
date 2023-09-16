const dotenv = require('dotenv')

class configLoader {
    async load () {
        dotenv.config({ path: './.env'});
    }
}

module.exports = new configLoader()