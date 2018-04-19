module.exports = function checkUser(email, password, userDatabase) {
  // Returns the userID if the user is in userDatabase

  for (var userID in userDatabase){
    if (userDatabase[userID].email === email && userDatabase[userID].password === password){
      return userID;
    }
  }
  return false;
};
