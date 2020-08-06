// Helper functions here

// Verification if new user e-mail already exists in database

const verifyEmail = (database, email) => {
  for (let user in database) {
    if (database[user].email === email) {
      return true;
    }
  }
};

// Filters URL database belonging to that specific user

const urlsForUser = (database, id) => {
  const userData = {};
  for (const url in database) {
    if (database[url].userID === id) {
      userData[url] = database[url];
    }
  }
  return userData;
}

// Searches user by e-mail

const getUserByEmail = (email, database) => {
  return Object.keys(database).filter((elem) => database[elem].email === email);
};

// Random ID Generator - generates a random a string of 6 random aplhanumeric characters

const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

module.exports = {
  generateRandomString,
  verifyEmail,
  getUserByEmail,
  urlsForUser
};