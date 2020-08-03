// Depedencies

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Default port, app and engine usage

const PORT = 8080; 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// URL Database

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Random ID Generator - generates a random a string of 6 random aplhanumeric characters

const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
}

// Endpoints

app.get("/", (req, res) => {
  res.send("Hello!\n");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b>!</body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// Server listening

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})