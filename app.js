//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const e = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// 
app.use(express.static("public"));
// local connection to localhost db
mongoose.connect("mongodb://localhost:27017/countriesDB", { useNewUrlParser: true });
// country schema object 
const countrySchema = {
  country: String,
  capital: String,
  continent: String
};

const Country = mongoose.model("Countries", countrySchema);
// Request Targeting all specific articles
app
  .route("/countries") // get data from db 
  .get(function (req, res) {
    Country.find(function (err, foundCountries) {
      if (!err) {
        res.send(foundCountries);
      } else {
        res.send(err);
      }
    });
  })
// Add new data (country) to database
  .post(function (req, res) {
    const newCountry = new Country({
      country: req.body.country,
      capital: req.body.capital,
      continent: req.body.continent,
    });
    newCountry.save(function (err) {
      if (!err) {
        res.send("Successfully added a new country.");
      } else {
        res.send(err);
      }
    });
  })
// deletes all countries (data) from db 
  .delete(function(req, res){
    Country.deleteMany(function (err){
      if(!err){
        res.send("Successfully deleted all countries.");
      }
      else{
        res.send(err);
      }
    })
  });

// 

/************* REQUEST BY SPECIFIC TARGET COUNTRY *******/

app.
route("/countries/:countryTitle")
// find a country by name
.get(function (req, res){
  Country.findOne(
    {country: req.params.countryTitle},
    function (err, foundCountry) {
      if(foundCountry){
        res.send(foundCountry);
      }
      else {
        res.send("No countries matching found!");
      }
    }
  )
})

// update a country data 
.put(function(req, res){
  Country.replaceOne(
    {country: req.params.countryTitle},
    {country: req.body.country, capital: req.body.capital, continent: req.body.continent},
    {overwrite: true},
    function (err) {
      if(!err){
        res.send("Successfully updated country");
      }
      else {
        res.send(err);
      }
    }
  )
})

.patch(function (req, res) {
  Country.updateOne(
    { country: req.params.countryTitle },
    { $set: req.body },
    function (err) {
      if (!err) {
        res.send("Successfully updated country.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function (req, res) {
  Country.deleteOne({ country: req.params.countryTitle }, function (err) {
    if (!err) {
      res.send("Successfully deleted country.");
    } else {
      res.send(err);
    }
  });
});




app.listen(3000, function () {
  console.log("Server started on port 3000");
});
