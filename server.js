const express = require('express'),
    bodyParser = require('body-parser'),
    rp = require('request-promise'),
    app = express(),
    config = {
        server: {
            ip: '127.0.0.1',
            port: '3500'
        }
    },
    nearbyCitiesService = "http://localhost:3600/";

app.use(bodyParser.json());

app.listen(config.server.port, config.server.ip, (err) => {
    if (err) console.log(err);
    console.log('server listening at', config.server.ip, config.server.port);
});

app.get('/get/', (req, res) => {
    const query = req.query,
        targetURL = nearbyCitiesService + `get/?lat=${query.lat}&lon=${query.lon}&radius=${query.radius}`;
    rp(targetURL)
        .then(function(data) {
            return res.json(JSON.parse(data));
        })
        .catch(function(err) {
            return res.json({
                error: "error"
            });
        });

});

app.get('/get/blabla', (req, res) => {
    const query = req.query,
        baseUrl = "https://public-api.blablacar.com/api/v2/trips?",
        key = "key=bec1eafb73de4b77a3934f0b7088d674",
        fc = "fc=",
        page = "page=",
        url = baseUrl + fc + encodeURI(query.lat + '|' + query.lon) + "&" + key + "&" + page + query.page;

    console.log("blabla", url);
    rp(url)
        .then(function(data) {
            const results = [];
            data = JSON.parse(data);

            data.trips.forEach(trip => {
                let splittedDate = trip.departure_date.split(" "),
                    formattedData = {
                        arrivalPlace: {},

                    };
                formattedData.arrivalPlace.latitude = trip.arrival_place.latitude;
                formattedData.arrivalPlace.longitude = trip.arrival_place.longitude;
                formattedData.arrivalPlace.cityName = trip.arrival_place.city_name;
                formattedData.departureDate = splittedDate[0];
                formattedData.departureHour = splittedDate[1];
                formattedData.duration = Math.round(trip.duration.value / 3600);
                results.push(formattedData);
            })
            console.log(results);
            return res.json(results);
        })
        .catch(function(err) {
            return res.json({
                error: "error"
            });
        });

});
