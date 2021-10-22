const { userQueries } = require('./user/queries');
const locationQueries = require('./location/queries');
const userMutations = require('./user/mutations');


const query = {
    user: userQueries,
    location: locationQueries
}

const mutate = {
    user: userMutations
}

module.exports = {
    query,
    mutate
}