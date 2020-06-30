//contains sceme & functionality of user profile used during authentication

const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

const userProfileSchema = new mongoose.Schema({
    userID: {
        type: ObjectID,
        required: true
    },
    redditData: mongoose.Schema.Types.Mixed
})

var userProfile = mongoose.model("userProfiles", userProfileSchema)

module.exports = {
    getUserProfile: async (userID) => {
        try {
            let profile = await userProfile.findOne({ userID: userID }).exec();
            return profile
        } catch (err) {
            err.stack;
        }
    },

    createNewUser: async (id, redditProfile) => {
        try {
            const newProfile = new userProfiles({
                userID : id,
                redditProfile : redditProfile
            })
            await newProfile.save().exec();
        } catch (err) {
            err.stack;
        }
    }
}


