function getUsers(parent, args, context) {
    console.log('OH HERRROOOO')
}

const resolvers = {
    Query: {
        users: getUsers
    },

};
module.exports = resolvers;