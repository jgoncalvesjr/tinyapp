// Depedencies

const express = require("express");
const app = express();

// Default port

const PORT = 8080; 

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Endpoints

app.get("/", (req, res) => {
  res.send("Hello!\n");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b>!</body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});

// Server listening

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})