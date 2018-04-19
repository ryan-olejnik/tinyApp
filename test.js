/*


- server logs in with incorrect email even as long as cookie is present (but user is not in database)




*/

const checkUser = require('./checkUser.js');



const userDatabase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "ryan@example.com", 
    password: "pass"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

console.log(checkUser('ryan@example.com', 'pass', userDatabase).isValid);
