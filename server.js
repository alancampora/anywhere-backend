const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    config = {
        server: {
            ip: '127.0.0.1',
            port: '3500'
        }
    },
    router = express.Router();


app.use(bodyParser.json());

app.listen(config.server.port, config.server.ip, (err) => {
    if (err) console.log(err);
    console.log('server listening at', config.server.ip, config.server.port);
});

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

require('./routes/routes')(router);

