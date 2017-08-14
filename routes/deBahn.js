const rp = require('request-promise');

module.exports = ( function(){
    
    const host = "https://api.deutschebahn.com/fahrplan-plus/v1/",
          headers = { "Authorization": "Bearer a64a52822034636f70c02d11eefd7038" };

    // --------- Public
    const get = (req, res) => {
            const query = req.query;
            getLocation("location", { main: query.name })
                .then(locationData => getDepartureBoard("departureBoard", JSON.parse(locationData)))
                .then(departures => getJourneisDetails("journeyDetails", JSON.parse(departures)))
                .then(journeys => res.json(response(journeys)))
                .catch(err => res.json({ error: err }));
    };

    // --------- Private
    
    // response:: [ResolvedPromises] -> JSON
    const response = (journeys) => journeys.map(journey => JSON.parse(journey));

    //getJourneisDetails: String -> String -> String -> Object -> [ResolvedPromises]
    const getJourneisDetails =  (journeyService, departures) =>  Promise.all(
        departures.map(departure => makeRequest(journeyService, {main: encodeURI(departure.detailsId)}))
    );

    //getLocation: String -> String -> String -> Object -> Promise
    const getLocation = (locationService, parameters) =>  makeRequest(locationService, parameters);

    //getDepartureBoard: String -> String -> String ->  Object -> Promise
    const getDepartureBoard = (departureBoardService, locationData) => makeRequest(departureBoardService, {
            main: locationData[0].id,
            date: "2017-08-20"
    });

    //makeRequest: String -> String -> String -> Object-> Promise 
    const makeRequest = function(service, parameters) {
        const
            url = createUrl(host, service, parameters),
            endPoint = {
                uri: url,
                headers: headers
            };
        return rp(endPoint);
    };

    // createUrl:: String -> String -> Obj -> String
    const createUrl = function(host, service, options) {
        let results,
            parameters = "";

        for (let key in options) {
            parameters += key === "main" ?
                options[key] :
                "?" + key + "=" + options[key];
        }

        return host + service + "/" + parameters;

    };

    return {
        get: get    
    }
})();

