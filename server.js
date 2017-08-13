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
