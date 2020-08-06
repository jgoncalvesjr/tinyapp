// Databases here

// User Database

const users = {
  "xp106b": {
    id: "xp106b",
    email: "user@example.com",
    password: "$2y$10$xHd3oT6fEU2DdBbeTeQSIuCf1rr0Msscs8etSqh/oooFp5Pv2P172"
  },
  "tl3z8n": {
    id: "tl3z8n",
    email: "user2@example.com",
    password: "$2y$10$iVQiksmNBzbN5B85DvZknenko75lZd5aWSccB6hOLmgBqhmBwDtyO"
  }
};

// URL Database

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "xp106b" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "xp106b" }
};

module.exports = {
  users,
  urlDatabase
};