const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sqlService = require('../../foundation/common/services/database-srvc')
const { promisify } = require('util');

class userDataService {
    async login(request) {
        let response = {
            statusCode: null,
            message: {},
            token: null,
            cookieOptions: null
        }
        try {
            const { email, password } = request.body;
            if (!email || !password) {
                response.statusCode = 400
                response.message = {
                    message: 'Please provide an email and password'
                }
                return response
            }
            let query = 'SELECT * FROM users WHERE email = ?'
            let param = [email]
            let queryResult = await sqlService.executeQuery(query, param)
            if (queryResult.length === 0 || !queryResult || !(await bcrypt.compare(password.toString(), queryResult[0].password))) {
                response.statusCode = 401
                response.message = {
                    message: 'Email or Password is incorrect'
                }
                return response
            } else {
                const id = queryResult[0].id;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: 'auto'
                }

                response.statusCode = 200
                response.message = {
                    Status: 'Success'
                }
                response.token = token
                response.cookieOptions = cookieOptions
                return response
            }
        } catch (error) {
            console.log(error)
        }
    }

    async register(request) {
        const { name, email, password, passwordConfirm } = request.body;
        let response = {
            statusCode: null,
            message: {}
        }
        try {
            let query = 'SELECT * FROM users WHERE email = ?'
            let param = [email]
            let queryResult = await sqlService.executeQuery(query, param)

            if (queryResult.length > 0) {
                response.statusCode = 400
                response.message = {
                    message: 'That email is already in use'
                }
                return response
            } else if (password !== passwordConfirm) {
                response.statusCode = 400
                response.message = {
                    message: 'Password do not match'
                }
                return response
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            let registerQuery = 'INSERT INTO users SET ?'
            let registerParams = { name: name, email: email, password: hashedPassword }
            let registerQueryResult = await sqlService.executeQuery(registerQuery, registerParams)
            if (Array.isArray(registerQueryResult) && registerQueryResult.length === 0) {
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

    async isUserLoggedIn(request) {
        let response = {
            statusCode: null,
            message: {}
        }
        if (request.cookies.jwt) {
            try {
                const decode = await promisify(jwt.verify)(request.cookies.jwt,
                    process.env.JWT_SECRET)
                let query = 'SELECT * FROM users WHERE id = ?'
                let param = [decode.id]
                let queryResult = await sqlService.executeQuery(query, param)
                if (queryResult.length === 0) {
                    response.statusCode = 200
                    response.message = {
                        Status: 'Failiure'
                    }
                } else {
                    response.statusCode = 200
                    response.message = {
                        Status: 'Success'
                    }
                    response.user = queryResult[0];
                }
                return response
            } catch (error) {
                console.log(error)
            }
        } else {
            response.statusCode = 200
            response.message = {
                Status: 'Failiure'
            }
            return response
        }
    }
}

module.exports = new userDataService()