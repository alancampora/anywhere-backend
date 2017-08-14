const deBahn = {},
    rp = require('request-promise');

deBahn.get = (req, res) => {
    const query = req.query,
        host = "https://api.deutschebahn.com/fahrplan-plus/v1/",
        headers = {
            "Authorization": "Bearer a64a52822034636f70c02d11eefd7038"
        }

    makeRequest(host, headers, "location" , { main: query.name })
        .then(data => makeRequest(host,headers,"departureBoard", {main: JSON.parse(data)[0].id, date: "2017-08-20"}))
        .then(data => { 
            let departures = JSON.parse(data); 
            departures = departures.map(departure =>makeRequest(host, headers, "journeyDetails", { main: encodeURI(departure.detailsId)}));
            return Promise.all(departures);
        })
        .then(data => {
            let journeys = data.map(journey => JSON.parse(journey))
            res.json(journeys);
        })
        .catch( err => res.json({error: err }));
};


//getLocation: String -> String -> String -> Object-> Promise 
function makeRequest(host, headers, service, parameters) {
    const 
        url = createUrl(host, service, parameters),
        endPoint = {
            uri: url,
            headers: headers
        };
    console.log(endPoint);
    return rp(endPoint);
}


// createUrl:: String -> String -> Obj -> String
function createUrl(host, service, options) {
    let results, 
        parameters="";

    for (let key in options) {
        parameters += key==="main" ? 
                options[key] : 
                "?" +key + "=" + options[key];
    }

    return host + service + "/" + parameters;

}

module.exports = deBahn;
