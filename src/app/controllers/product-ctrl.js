const service = require('../services/product-srvc')

module.exports = class userDataController {

    constructor(router) {

        router.post('/checkout', this.checkout.bind(this))
        
    }
    
    async checkout(restRequest, restResponse) {
        let response = await service.checkout(restRequest)
        if (response && response.statusCode) {
            restResponse.status(response.statusCode).json(response.message)
        }
    }

}