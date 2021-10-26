const { userQueries } = require('./user/queries');
const locationQueries = require('./location/queries');
const userMutations = require('./user/mutations');
const messageQueries = require('./messages/queries');

const query = {
    user: userQueries,
    location: locationQueries,
    message: messageQueries
}

const mutate = {
    user: userMutations
}

module.exports = {
    query,
    mutate
}