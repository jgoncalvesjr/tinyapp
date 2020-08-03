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

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = urlDatabase[shortURL];
  console.log(req.body);
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
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