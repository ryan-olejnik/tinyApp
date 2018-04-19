module.exports = function checkUser(username, password, userDatabase) {
  // This function determines if the user (username, password) is in userDatabase (in the global scope). 
  // Returns true if the are, false if they are not

  var isUserMatch = false;
  var isPassMatch = false;
  var isValid = false;
  var errorStatus = '';


  // Note that the users EMAIL IS THEIR USERNAME

  for (let user in userDatabase){
    if (userDatabase[user].email === username && userDatabase[user].password === password) {
      isUserMatch = true;
      isPassMatch = true;
    }
    else if (userDatabase[user].email === username && userDatabase[user].password !== password){
      isUserMatch = true;
    }
  }

  if (isUserMatch === true && isPassMatch === true){
    isValid = true;
  } else if (isUserMatch === true && isPassMatch === false){
    errorStatus = 'Incorrct Password!';
  } else {
    errorStatus = 'Incorrect Email!';
  }

  return {isValid: isValid, errorStatus: errorStatus};

};
