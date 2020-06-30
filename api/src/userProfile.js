//contains sceme & functionality of user profile used during authentication

const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("open", function (ref) {
    console.log("Connected to mongo server.");
});

mongoose.connection.on("error", function (err) {
    console.log("Could not connect to mongo server!");
    return console.log(err);
});

const userProfileSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    redditProfile: mongoose.Schema.Types.Mixed
})


let userProfile = mongoose.model("userProfile", userProfileSchema, "userProfiles")

module.exports = {
    getUserProfile: async (id) => {
        try {
            let profile = await userProfile.findOne({ userID: id }).exec()
            return profile
        } catch (err) {
            err.stack
        }
    },

    createNewUser: async (id, redditProfile) => {
        try {
            let newProfile = new userProfile({
                userID: id,
                redditProfile: redditProfile
            })
            await newProfile.save().exec();
        } catch (err) {
            err.stack;
        }
    }
}


