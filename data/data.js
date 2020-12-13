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
  "b2xVn2": { 
    longURL: "http://www.lighthouselabs.ca", 
    userID: "xp106b", 
    urlVisits: 0, 
    uniqueVisits: [], 
    createdAt: "November 15th 2017, 11:59:59am",
    visitedAt: "November 16th 2017, 11:59:59pm" },
  "9sm5xK": { 
    longURL: "http://www.google.com", 
    userID: "xp106b", 
    urlVisits: 0, 
    uniqueVisits: [], 
    createdAt: "July 21st 2018, 1:20:11pm", 
    visitedAt: "July 21st 2018, 1:20:11pm" }
};

module.exports = {
  users,
  urlDatabase
};