const { Location } = require('../../models');

const locationQueries = {
    async findAll() {
        const data = await Location.find({});
        return data;
    },
}

module.exports = {
    locationQueries
}