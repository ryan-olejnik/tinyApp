var userDatabase = {
  user_1: { email: 'ryan@gmail.com', password: 'password' },
  user_2: { email: 'ryano', password: 'ryan1234' } 
};

// user1
var input_email = 'ryan@gmail.com';
var input_password = 'password';


console.log(Object.keys(userDatabase).length)

// determine if user1 is in the database:
var isUserMatch = false;
var isPassMatch = false;



for (let user in userDatabase){
  if (userDatabase[user].email == input_email && userDatabase[user].password == input_password) {
    isUserMatch = true;
    isPassMatch = true;
  }
  else if (userDatabase[user].email == input_email && userDatabase[user].password !== input_password){
    isUserMatch = true;
  }
}

if (isUserMatch === true && isPassMatch === true){
  console.log('You are a member!');
} else if (isUserMatch === true && isPassMatch === false){
  console.log('Incorrect Password!!');
} else {
  console.log('Incorrect Username :(:::');
}


