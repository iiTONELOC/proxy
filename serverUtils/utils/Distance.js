const deg2rad = require('@stdlib/math-base-special-deg2rad');
const Distance = function (latitude1, longitude1, latitude2, longitude2, units) {
    const earthRadius = 6371; // Radius of the earth in km
    const dLat = deg2rad(latitude2 - latitude1);  // deg2rad below
    const dLon = deg2rad(longitude2 - longitude1);
    const a =
        (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
        (Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2))) *
        (Math.sin(dLon / 2) * Math.sin(dLon / 2))
        ;
    const c = 2 * (Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    const d = earthRadius * c;
    const miles = d / 1.609344;

    if (units == 'km') {
        return d;
    } else {
        return miles
    }
}

module.exports = Distance;
