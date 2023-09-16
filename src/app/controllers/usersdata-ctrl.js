const service = require('../services/userdata-srvc')

module.exports = class userDataController {

    constructor(router) {

        router.post('/login', this.userLogin.bind(this))
        router.post('/register', this.userRegister.bind(this))
        router.post('/logout', this.userLogout.bind(this))
        router.post('/isLoggedIn', this.isLoggedIn.bind(this))
    }

    async userLogin(restRequest, restResponse) {
        let response = await service.login(restRequest)
        if (response && response.statusCode) {
            restResponse.cookie('jwt', response.token, response.cookieOptions)
            restResponse.status(response.statusCode).json(response.message)
        }
    }

    async userRegister(restRequest, restResponse) {
        let response = await service.register(restRequest)
        if (response && response.statusCode) {
            restResponse.status(response.statusCode).json(response.message)
        }
    }

    async userLogout(restRequest, restResponse) {
        restResponse.cookie('jwt', 'logout', {
            expires: new Date(Date.now() + 2 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        restResponse.status(200).json({Status: 'Success'})
    }

    async isLoggedIn(restRequest, restResponse) {
                let response = await service.isUserLoggedIn(restRequest)
        if (response && response.statusCode) {
            restResponse.status(response.statusCode).json(response.message)
        }
    }

}