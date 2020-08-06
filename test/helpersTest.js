const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "xp106b": {
    id: "xp106b",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "tl3z8n": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrls =  {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "xp106b" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "tl3z8n" },
  "2wKiX4": { longURL: "http://www.nba.com", userID: "xp106b" }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "xp106b";
    assert.strictEqual(user, expectedOutput);
  });
  it('should return undefined if email does not exist in the database', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    assert.strictEqual(user, undefined);
  });
});

describe('urlsForUser', function() {
  it('should return an object containing only the pages for a given user', function() {
    const urls = urlsForUser(testUrls, "xp106b");
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "xp106b" },
      "2wKiX4": { longURL: "http://www.nba.com", userID: "xp106b" }
    };
    assert.deepEqual(urls, expectedOutput);
  });
  it('should return an empty object if user does not have any pages', function() {
    const urls = urlsForUser(testUrls, "9kI7vX");
    const expectedOutput = {};
    assert.deepEqual(urls, expectedOutput);
  });
});