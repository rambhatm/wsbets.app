const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv')
dotenv.config()

module.exports = {

    /* 
     * Mongo Utility: Connect to client */

    Connect: async () => (

        client = await (() => (new Promise((resolve, reject) => (

            MongoClient.connect(process.env.MONGO_URL,
                (err, client) => {
                    assert.equal(null, err);
                    resolve(client);
                })
        )
        )))()),


    /* 
     * Mongo Utility: Close client */

    Disconnect: async (client) => {
        client.close();
        return true;
    }
};