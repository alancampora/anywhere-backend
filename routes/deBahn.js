const deBahn = {},
    rp = require('request-promise');

deBahn.get = (req, res) => {
    const query = req.query,
        host = "https://api.deutschebahn.com/fahrplan-plus/v1/",
        headers = {
            "Authorization": "Bearer a64a52822034636f70c02d11eefd7038"
        }

    getLocation(host, headers, "location" , { main: query.name })
        .then(locationData => getDepartureBoard(host, headers, "departureBoard", JSON.parse(locationData)))
        .then(departures => getJourneisDetails(host,headers,"journeyDetails",JSON.parse(departures)))  
        .then(data => {
            let journeys = data.map(journey => JSON.parse(journey))
            console.log(journeys);
            res.json(journeys);
        })
        .catch( err => res.json({error: err }));
};

//getJourneisDetails: String -> String -> String -> Object -> [ResolvedPromises]
function getJourneisDetails(host,headers,journeyService, departures){
    var promises = departures.map(departure => makeRequest(host, headers, journeyService, { main: encodeURI(departure.detailsId) }))
    return Promise.all(promises);
}

//getLocation: String -> String -> String -> Object -> Promise
function getLocation(host,headers,locationService,parameters){
    return makeRequest(host, headers, locationService, parameters);
};

//getDepartureBoard: String -> String -> String ->  Object -> Promise
function getDepartureBoard(host, headers, departureBoardService, locationData){
    return makeRequest(host,headers,departureBoardService, {main: locationData[0].id, date: "2017-08-20"})
};

//makeRequest: String -> String -> String -> Object-> Promise 
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
