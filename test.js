var defaultUrlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const checkUserLogin = require('./checkUserLogin.js');



const userDatabase = { 
  "user234324": {
    userID: "user234324",
    email: "ryan@example.com", 
    password: "pass",
    urlDatabase: defaultUrlDatabase

  },
 "user2323432": {
    userID: "user2323432",
    email: "user2@example.com", 
    password: "dishwasher-funk",
    urlDatabase: defaultUrlDatabase
  }
};

var userID = checkUserLogin('ryan@example.com', 'pass', userDatabase);
console.log(userDatabase[userID]);

/*
   { email: 'myemail',
     password: 'pass',
     urlDatabase: 
      { b2xVn2: 'http://www.lighthouselabs.ca',
        '9sm5xK': 'http://www.google.com' },
     userID: 'user1367563' }

*/
