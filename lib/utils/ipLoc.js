const extIP = require("ext-ip")();
const geoip = require('geoip-lite');
// GRABS CORDS BASED OFF IP

const lookup = (userIP) => {
    console.log("++++++LOCATION+++++", userIP);
    if (userIP.includes('::ffff')) {
        return null
    }
    try {
        const locationData = geoip.lookup(userIP)
        const { city, state, region, timezone, ll } = locationData
        const lat = ll[0];
        const lon = ll[1];
        const data = {
            city: city || 'data changed',
            state: state || region || 'data changed',
            latitude: lat,
            longitude: lon,
            timezone: timezone
        };
        return data;
    } catch (error) {
        console.error(error);
        return null;
    };
};
class IpLocation {
    // by ip or reqObj
    static async get(req) {
        const client = req.ip || req;
        if (client === '::1' || client === '::ffff:127.0.0.1') {
            const response = await extIP.get().then(ip => {
                return lookup(ip);
            }, err => {
                console.log(err);
                return null;
            });
            return response;
        } else {
            return lookup(client);
        }
    };
    // if you want to check for location data first
    static async user(args, ip) {
        const { latitude, longitude, } = args ? args : {};
        if (latitude == undefined || longitude == undefined || latitude == null || longitude == null) {
            try {
                return IpLocation.get(ip);
            } catch (error) {
                console.error("Error occurred while fetching location details", error);
            };
        } else {
            const { city, state } = await IpLocation.get(ip);
            const { latitude, longitude } = args;
            return {
                city, state, latitude, longitude
            };
        };
    };
}


module.exports = IpLocation;