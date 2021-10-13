const extIP = require("ext-ip")();
const geoip = require('geoip-lite');
// GRABS CORDS BASED OFF IP

const lookup = (userIP) => {
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
class Location {
    // by ip
    static async get(req) {
        const client = req.ip || req;
        if (client === '::1' || client === '::ffff:127.0.0.1' /*|| client.match(/^([::ffff])$/)*/) {
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
    static async user(args, context) {
        const { latitude, longitude, } = args;
        if (latitude == undefined || longitude == undefined) {
            try {
                return Location.get(context);
            } catch (error) {
                console.error("Error occurred while fetching location details", error);
            };
        } else {
            return {
                ...args
            };
        };
    };
}


module.exports = Location;