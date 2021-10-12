const userQueries = require('./user/queries');
const locationQueries = require('./location/queries');


const query = {
    user: userQueries,
    location: locationQueries
}



module.exports = {
    query
}