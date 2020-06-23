const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
dotenv.config()

module.exports = {
    getProfile: async (userID) => {
        try {
            let client = await MongoClient.connect(process.env.MONGO_URL,{ useUnifiedTopology: true })
            let profile = await client.db(process.env.MONGO_DB_NAME)
                .collection(process.env.MONGO_USERS_COLLY)
                .findOne({ 'userID': userID })
            client.close()
            return profile
        } catch (error) {
            throw error
        }
    },

    setProfile: async (profile) => {
        try {
            let client = await MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true })
            let result = await client.db(process.env.MONGO_DB_NAME)
                .collection(process.env.MONGO_USERS_COLLY)
                .insertOne(profile)
            client.close()
        } catch (error) {
            throw error
        }
    }
}

