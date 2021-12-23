const Distance = require('../../../utils/Distance');

module.exports = {
    getDistances(currentUser, allUsersArray, radius) {

        const AllUsers = allUsersArray.filter(el => el._id.toString() != currentUser._id.toString());
        const data = currentUser.location
        //  lat-lon 1
        const { latitude, longitude } = data;
        // map over users
        const d = AllUsers.map((el) => {
            const data2 = el.location;
            // lat-lon 2
            const lat2 = data2.latitude;
            const long2 = data2.longitude;
            // calculate distance between users
            const howFar = Distance(latitude, longitude, lat2, long2)
            // less than x miles away, return
            if (howFar < radius) {
                if (el.status.online === true && el !== undefined && el !== 'undefined') {
                    return el
                }
            }
        });
        const usersToSet = d.filter(el => el !== undefined)
        return usersToSet
    },
}