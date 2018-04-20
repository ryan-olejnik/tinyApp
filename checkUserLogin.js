module.exports = function checkUser(email, password, userDatabase) {
  // Returns the userID if the user is in userDatabase
  const bcrypt = require('bcrypt');

  for (var userID in userDatabase){
    if (userDatabase[userID].email === email && bcrypt.compareSync(password, userDatabase[userID].password)){
      return userID;
    }
  }
  return false;
};
