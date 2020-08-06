// Depedencies

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const morgan = require('morgan');
const {
  generateRandomString,
  verifyEmail,
  getUserByEmail,
  urlsForUser
} = require('./helpers');
const {
  users,
  urlDatabase
} = require('./data');

// Default port, app and engine usage

const PORT = 8080;
app.set("view engine", "ejs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['cookieStorageForTinyAppWebsite', 'Very secure long sentence']
}));

// Endpoints

// GET routes

// Redirection from root

app.get("/", (req, res) => {
  res.redirect('/urls');
});

// Register page

app.get("/register", (req, res) => {
  const user = req.session.user_id;
  const templateVars = { user: users[user] };
  res.render('urls_register',templateVars);
});

// Login page

app.get("/login", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    user: users[user],
  };
  res.render('urls_login',templateVars);
});


// List of shortened URLs

app.get("/urls", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    user: users[user],
    urls: urlsForUser(urlDatabase, user)
  };
  res.render("urls_index", templateVars);
});

// New Shortened URL

app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  if (!user) {
    return res.redirect('/urls');
  }
  const templateVars = { user: users[user] };
  res.render("urls_new", templateVars);
});

// Redirection from newly created short URL

app.get("/urls/:id", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    user: users[user],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL };
  if (!user) {
    return res.redirect('/urls');
  }
  res.render("urls_show", templateVars);
});

// POST routes

// User registration. Stores new user ID, e-mail and password to object and stores cookie with new user ID

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, salt);
  if (!email || !password) {
    return res.status(400).send('No email or password informed!');
  }
  if (verifyEmail(users, email)) {
    return res.status(400).send('This email is already registered!');
  }
  users[id] = {
    id,
    email,
    password
  };
  req.session.user_id = id;
  res.redirect('/urls');
});

// User login. Stores cookie with new user ID

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!verifyEmail(users, email)) {
    res.status(403).send('User or password do not match! Please verify your forms!');
    return;
  }
  const logUser = getUserByEmail(email, users);
  // const logUser = Object.keys(users).filter((e) => users[e].email === email);
  if (!bcrypt.compareSync(password, users[logUser].password)) {
    res.status(403).send('User or password do not match! Please verify your forms!');
    return;
  }
  req.session.user_id = users[logUser].id;
  res.redirect('/urls');
});

// User logout. Clears user ID cookie

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// On link shortening POST, generates a random alphanumeric string for shortened link, makes it a key/pair value in urlDatabase object, and redirects to newly created shortened page

app.post("/urls", (req, res) => {
  // console.log(req.body); // logs POST request body to server console. Should be the long URL
  const userID = req.session.user_id;
  const shortURL = generateRandomString();
  if (!req.body.longURL) {
    return res.status(400).send('Web address cannot be empty!');
  }
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID };
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// Specific path routes. GET followed by POST

// Redirection from shortened URL to original URL

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (longURL.includes("http://") || longURL.includes("https://")) {
    res.redirect(longURL);
  } else {
    res.redirect(`http://${longURL}`);
  }
});

// Updates an existing long page

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const userURL = urlsForUser(urlDatabase, userID);
  if (!longURL) {
    return res.status(400).send('Web address cannot be empty!');
  }
  if (userURL.hasOwnProperty(shortURL)) {
    urlDatabase[shortURL] = { longURL, userID };
    return res.redirect(`/urls/${shortURL}`);
  }
  res.status(403).send('TinyURL does not belong to current user, permission denied!\n');
});

// deletes selected link and redirects to Index page (/urls)

app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.id;
  const userURL = urlsForUser(urlDatabase, userID);
  if (userURL.hasOwnProperty(shortURL)) {
    delete urlDatabase[shortURL];
    return res.redirect("/urls");
  }
  res.status(403).send('TinyURL does not belong to current user, permission denied!\n');
});

// Server listening

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});