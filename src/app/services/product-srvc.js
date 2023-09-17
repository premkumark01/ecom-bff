const sqlService = require('../../foundation/common/services/database-srvc')

class userDataService {

    async checkout(request) {
        let body = request.body;
        let response = {
            statusCode: null,
            message: {}
        }
        try {
            let checkoutQuery = 'INSERT INTO transaction_history SET ?'
            let checkoutParams = { name: body.name, email: body.email, address: body.address, city: body.city, state: body.state,
                 zipcode:body.zipcode, productid:body.productid, productname: body.productname, price: body.price, quantity:body.quantity }
            let checkoutQueryResult = await sqlService.executeQuery(checkoutQuery, checkoutParams)
            if (Array.isArray(checkoutQueryResult) && checkoutQueryResult.length === 0) {
                response.statusCode = 400
                response.message = {
                    Status: 'Failiure'
                }
            } else {
                response.statusCode = 200
                response.message = {
                    Status: 'Success'
                }
            }
            return response
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new userDataService()