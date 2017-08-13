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
            })
            return res.json(results);
        })
        .catch(function(err) {
            return res.json({
                error: "error"
            });
        });

});

//function getFlickrPhoto(lat, lon) {

    //const flickrService = {
        //baseUrl: "https://api.flickr.com/services/rest/?",
        //authToken: "auth_token=72157685013754423-a975daf6a06c36a7&",
        //key: "api_key=195f9e6bfd8621d296c7852591b97a54&",
        //methods: {
            //photoSearch: "method=flickr.photos.search",
            //getInfo: "method=flickr.photos.getInfo&"
        //},
        //format: "format=json",
        //noJsonCallback: "&nojsoncallback=1"
    //}

    //let url = this.baseUrl;

    //url += flickrService.methods.photoSearch + "&" + flickrService.key + "&" + "lat=" + lat + "&lon=" + lon + "&" + flickrService.format + flickrService.noJsonCallback;

    //rp()

    //flickr.photoSearch(trip.arrivalPlace.latitude, trip.arrivalPlace.longitude)
        //.then(data => {
            //var photo = data.photos.photo[0]
            //trip.photo =
                //`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
                //this is not ok
            //this.$forceUpdate();
        //})
        //.catch(error => console.log("error:", error))
    //return rp()
//}
