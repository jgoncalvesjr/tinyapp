// Middleware Depedencies

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const morgan = require('morgan');
const {
  generateRandomString,
  getUserByEmail,
  urlsForUser
} = require('./helpers');
const {
  users,
  urlDatabase
} = require('./data');

// Default port, middleware configuration

const PORT = 8080;
app.set("view engine", "ejs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['$2y$10$tWNvobOiIxH1OQA4Wx2kduY2pO1LyJgb4.t.U5L9qTYOdpKPrf1iC',
    '$2y$10$hQKw8jKo47lgT4PpvQNvce1YHr6TkjUH.3qODlUolS1orGxWWGtZS']
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


// List of shortened URLs. If no user is logged, becomes a welcome page with message and login/registration instructions.

app.get("/urls", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    user: users[user],
    urls: urlsForUser(urlDatabase, user)
  };
  res.render("urls_index", templateVars);
});

// Link to create a new Shortened URL. If no user is logged, redirects to welcome page

app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  if (!user) {
    return res.redirect('/urls');
  }
  const templateVars = { user: users[user] };
  res.render("urls_new", templateVars);
});

// Redirection from newly created short URL. If no user is logged, redirects to welcome page

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

// User registration. Stores new user ID, e-mail and password to object and stores cookie with new session ID

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, salt);
  if (!email || !password) {
    return res.status(400).send('No email or password informed!');
  }
  if (getUserByEmail(email, users)) {
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

// User login. Stores cookie with new session ID

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const logUser = getUserByEmail(email, users);
  if (!logUser || !bcrypt.compareSync(password, users[logUser].password)) {
    res.status(403).send('User or password do not match! Please verify your forms!');
    return;
  }
  req.session.user_id = users[logUser].id;
  res.redirect('/urls');
});

// User logout. Clears cookie session

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// Created new short URL, stores it to URL database associating it to creator user, and redirects to new short URL details

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = generateRandomString();
  if (!req.body.longURL) {
    return res.status(400).send('Web address cannot be empty!');
  }
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

// Specific path routes. GET followed by POST

// Redirection from shortened URL to original URL. Makes sure it goes to a http:// address

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (longURL.includes("http://") || longURL.includes("https://")) {
    res.redirect(longURL);
  } else {
    res.redirect(`http://${longURL}`);
  }
});

// Updates an existing shortened URL with new long URL. Only user who owns short URL can change it

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

// Updates an existing shortened URL. Only user who owns short URL can delete it

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
  console.log(`TinyApp Server Listening on port ${PORT}!`);
});