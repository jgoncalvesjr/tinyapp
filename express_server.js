// Depedencies

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const morgan = require('morgan');

// Default port, app and engine usage

const PORT = 8080;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());

// User database

const users = {
  "xp106b": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "tl3z8n": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Verification if new user e-mail already exists in database

const verifyEmail = email => {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
};

// URL Database

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Random ID Generator - generates a random a string of 6 random aplhanumeric characters

const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

// Endpoints

// GET routes

// Redirection from root

app.get("/", (req, res) => {
  res.redirect('/urls');
});

// Register page

app.get("/register", (req, res) => {
  const user = req.cookies.userID;
  const templateVars = { user: users[user] };
  res.render('urls_register',templateVars);
});

// Login page

app.get("/login", (req, res) => {
  const user = req.cookies.userID;
  const templateVars = { user: users[user] };
  res.render('urls_login',templateVars);
});


// List of shortened URLs

app.get("/urls", (req, res) => {
  const user = req.cookies.userID;
  const templateVars = {
    user: users[user],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// New Shortened URL

app.get("/urls/new", (req, res) => {
  const user = req.cookies.userID;
  const templateVars = { user: users[user] };
  res.render("urls_new", templateVars);
});

// Lists URL page storage as JSON

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});

// Redirection from newly created short URL

app.get("/urls/:id", (req, res) => {
  const user = req.cookies.userID;
  const templateVars = {
    user: users[user],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

// POST routes

// User registration. Stores new user ID, e-mail and password to object and stores cookie with new user ID

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('No email or password informed!');
  }
  if (verifyEmail(email)) {
    return res.status(400).send('This email is already registered!');
  }
  users[id] = {
    id,
    email,
    password
  };
  res.cookie("userID", id);
  res.redirect('/urls');
});

// User login. Stores cookie with new user ID

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // const userEmails = Object.keys(users).map((e) => users[e].email);
  if (!verifyEmail(email)) {
    res.status(403).send('User not found! Please verify your forms!');
    return;
  }
  const logUser = Object.keys(users).filter((e) => users[e].email === email);
  if (users[logUser].password !== password) {
    res.status(403).send('Password does not match! Please verify your forms!');
    return;
  }
  res.cookie('userID', users[logUser].id);
  res.redirect('/urls');
});

// User logout. Clears user ID cookie

app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});

// On link shortening POST, generates a random alphanumeric string for shortened link, makes it a key/pair value in urlDatabase object, and redirects to newly created shortened

app.post("/urls", (req, res) => {
  console.log(req.body); // logs POST request body to server console. Should be the long URL
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Specific path (:/) routes. GET followed by POST

// Redirection from shortened URL to original URL

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (longURL.includes("http://") || longURL.includes("https://")) {
    res.redirect(longURL);
  } else {
    res.redirect(`http://${longURL}`);
  }
});

// Updates an existing long page

app.post("/urls/:id", (req, res) => {
  console.log(req.body); // prints the new URL in console
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

// deletes selected link and redirects to Index page (/urls)

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  console.log(urlDatabase); // prints object without deleted URL in the console
  res.redirect("/urls");
});

// Server listening

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});