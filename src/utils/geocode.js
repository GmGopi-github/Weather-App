const request = require("postman-request");

function geoCode(address, callback) {
  const accessToken = `pk.eyJ1IjoiZ29waWdtIiwiYSI6ImNsZW5zZXI0ZDFpZDQzcW5wZXRpcGx1ZTgifQ.kD_nBpg04bdiYg0HPTGWoA`;
  const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${accessToken}`;
  request(URL, (err, response, body) => {
    const data = JSON.parse(body);
    if (data.features.length != 0) {
      callback(err, {
        latitude: data.features[0].center[0],
        longitude: data.features[0].center[1],
      });
    } else {
      const error = { message: "Please Enter a correct location from geoCode" };
      callback(error, {});
    }
  });
}

module.exports = geoCode;
