const { User } = require("../../models");

const userQueries = {

    async findAll(parent, args, context) {
        const userData = await User.find({}).select('-__v -password -email').populate('location');
        return userData;
    },


}

module.exports = {
    userQueries
}