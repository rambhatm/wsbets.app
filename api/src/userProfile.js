const db = require('./mongoDB.js')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    getProfile: async (userID) => (await (() => {
        new Promise((resolve, reject) => (db.Connect().then(client => {
            client
                .db(process.env.MONGO_DB_NAME)
                .collection(process.env.MONGO_USERS_COLLY)
                .findOne({
                    userID: userID
                })
                .toArray((err, data) => {

                    db.Disconnect(client)
                    resolve(data[0])
                })
        })
        )
        )
    })()),
}

function verifyRedditUser(accessToken, refreshToken, profile, done) {
    const client = new MongoClient(process.env.MONGO_URL);
    client.connect(function (err) {
        if (err) {
            done(null, false, { message: 'Unable to connect to verify user' })
        }
        console.log("Connected successfully to mongo server");

        const db = client.db(process.env.MONGO_DB_NAME);
        const users = db.collection(process.env.MONGO_USERS_COLLY)
        users.findOne({ 'userID': profile.id })
            .then((doc) => {
                if (doc) {
                    //already existing User

                } else {
                    //new user
                }
            })

        client.close();
    });
    done(null, profile)
}

