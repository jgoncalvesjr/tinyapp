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

// List of shortened URLs

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// On link shortening POST, generates a random alphanumeric string for shortened link, makes it a key/pair value in urlDatabase object, and redirects to newly created shortened 

app.post("/urls", (req, res) => {
  console.log(req.body); // logs POST request body to server console. Should be the long URL 
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// New Shortened URL

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Lists URL page storage as JSON

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});

// Redirection from newly created short URL

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// Updates an existing long page

app.post("/urls/:id", (req, res) => {
  console.log(req.body); // prints the new URL in console
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

// deletes selected link and redirects to Index page (/urls)

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase); // prints object without deleted URL in the console
  res.redirect("/urls");
});

// Redirection from shortened URL to original URL

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (!longURL.includes("http://") || !longURL.includes("https://")) {
    res.redirect(`http://${longURL}`); 
  } else {
    res.redirect(longURL);
  }
});


// Server listening

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})