const rp = require('request-promise'),
    blabla = {};

blabla.get = (req, res) => {
    const query = req.query,
        baseUrl = "https://public-api.blablacar.com/api/v2/trips?",
        key = "key=bec1eafb73de4b77a3934f0b7088d674",
        fc = "fc=",
        page = "page=",
        url = baseUrl + fc + encodeURI(query.lat + '|' + query.lon) + "&" + key + "&" + page + query.page;

    rp(url)
        .then(function(data) {
            data = JSON.parse(data);
            const results = data.trips.map(trip => {
                let splittedDate = trip.departure_date.split(" ");
                return {
                    arrivalPlace: {
                        latitude: trip.arrival_place.latitude,
                        longitude: trip.arrival_place.longitude,
                        cityName: trip.arrival_place.city_name
                    },
                    departureDate: splittedDate[0],
                    departureHour: splittedDate[1],
                    duration: Math.round(trip.duration.value / 3600)
                }
            });
            //const kj
            return res.json(results);
        })
        .catch(function(err) {
            return res.json({
                error: "error"
            });
        });
}

module.exports = blabla;
