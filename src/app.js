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
const port = process.env.PORT || 3000;
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
app.listen(port, () => {
  console.log(`Server is running on port - ${port}`);
});
