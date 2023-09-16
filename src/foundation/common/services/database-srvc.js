// get the client
const mysql = require('mysql2/promise');

// get the promise implementation, we will use bluebird
const bluebird = require('bluebird');

class mySQLService {

    getConfiguration() {
        return {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE
        }
    }

    async InitializeDBConnection() {
        if (!this.client) {
            const mySQLConfig = this.getConfiguration()
            this.client = await mysql.createConnection(mySQLConfig)
            this.client.connect((err) => {
                if (err) {
                    console.log('DB Connection Error', err)
                } else {
                    console.log("Connected MySQL...")
                }
            })
        }
    }

    async executeQuery(query, params) {
        let response = []
        try {
            let [rows, fields] = await this.client.query(query, params);
            return rows
        } catch (err) {
            console.log(err);
        }
        return response
    }
}

module.exports = new mySQLService()