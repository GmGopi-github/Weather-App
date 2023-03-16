const path = require("path");
const request = require("postman-request");
const express = require("express");
const hbs = require("hbs");
const geoCode = require("./utils/geocode");
const foreCast = require("./utils/forecast");

// console.log(__dirname);
// console.log(path.join(__dirname,'../public'));
// express app
const app = express();

// define paths for express config
console.log("Directory Name: ", __dirname);
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setUp handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setUp static directory to serve.
app.use(express.static(publicDirPath));

// home page
app.get("/", (req, res) => {
  res.render("index", {
    name: "Gopi",
    from: "Nishi",
    title: "Home",
    by: "Gopi",
  });
});

// about page
app.get("/about", (req, res) => {
  res.render("about", {
    createdBy: "Gopi",
    title: "About",
    by: "Gopi",
  });
});

// help page
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    by: "Gopi",
  });
});

// weather page
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide a address",
    });
  }

  geoCode(req.query.address, (err, { latitude = null, longitude = null }) => {
    if (err) {
      return res.send({
        success: false,
        error: err.message,
      });
    }

    if (latitude && longitude) {
      foreCast(latitude, longitude, (err, result) => {
        if (err) {
          return res.send({
            success: false,
            error: err.message,
          });
        }
        res.send({
          success: true,
          location: req.query.address,
          forecast: result,
        });
      });
    }
  });

  /**
   * Access Token
   * pk.eyJ1IjoiZ29waWdtIiwiYSI6ImNsZW5zZXI0ZDFpZDQzcW5wZXRpcGx1ZTgifQ.kD_nBpg04bdiYg0HPTGWoA
   */
  // const accessToken=`pk.eyJ1IjoiZ29waWdtIiwiYSI6ImNsZW5zZXI0ZDFpZDQzcW5wZXRpcGx1ZTgifQ.kD_nBpg04bdiYg0HPTGWoA`;
  // const url=`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.query.address}.json?access_token=${accessToken}`;
  // request(url,(err,response,body)=>{
  //     if(err){
  //         return res.send({
  //             success:false,
  //             err
  //         })
  //     };
  //     const parsedData=JSON.parse(body);

  //     const coordinate1= parsedData.features[0].center[0];
  //     const coordinate2= parsedData.features[0].center[1];

  //     console.log('coordinates: ',coordinate1,coordinate2);

  //     const url1=`http://api.weatherstack.com/current?access_key=2bc3a060f6402bf2b5e64b2a01c16aca&query=${coordinate1},${coordinate2}`

  //     request(url1,(err,response,body)=>{
  //         if(err){
  //             console.log('Error',err);
  //             return res.send({
  //                 success:false,
  //                 err
  //             })
  //         };
  //         const data=JSON.parse(body);
  //         res.send({
  //             success:true,
  //             data
  //         })
  //     });
  // })
});
app.get("/products/:prodId", (req, res) => {
  console.log("query", req.query);
  console.log("params", req.params);
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  res.send({
    products: [],
  });
});
// for urls not matching after /help
app.get("/help/*", (req, res) => {
  res.render("helpArticleNotFound");
});

// for urls not matching above endpoints(404 handler)
app.get("*", (req, res) => {
  // res.send('MY 404 PAGE');
  res.render("notFound", {
    title: "404 - ",
    by: "Gopi",
  });
});
// starting the server
app.listen(3000, () => {
  console.log("Server is running on port - 3000");
});
