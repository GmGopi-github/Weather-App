const request = require("postman-request");

function foreCast(latitude, longitude, callback) {
  const URL = `http://api.weatherstack.com/current?access_key=2bc3a060f6402bf2b5e64b2a01c16aca&query=${latitude},${longitude}`;

  request(URL, (err, response, body) => {
    const data = JSON.parse(body);
    console.log("data: ", data);
    if (data?.current?.temperature && data?.current?.precip >= 0) {
      callback(err, {
        forecast: `It's currently ${data?.current?.temperature} degrees outside. It feels like ${data?.current?.precip} chances to rain.`,
      });
    } else {
      const error = {
        message: "Please Enter a correct location from Forecast",
      };
      callback(error, {});
    }
  });
}

module.exports = foreCast;
