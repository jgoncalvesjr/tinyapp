// Helper functions here

// Filters URL database belonging to that specific user
const urlsForUser = (database, id) => {
  const userData = {};
  for (const url in database) {

    if (database[url].userID === id) {
      userData[url] = database[url];
    }

  }
  return userData;
};

// Searches user by e-mail, returns a string with user ID
const getUserByEmail = (email, database) => {
  const user = Object.keys(database).filter((elem) => database[elem].email === email).toString();

  if (!user) {
    return undefined;
  }

  return user;
};

// Validates a URL address
const isValidURL = url => {
  return url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://");
};

// Random ID Generator - generates a random a string of 6 random aplhanumeric characters

const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  isValidURL
};