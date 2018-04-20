const bcrypt = require('bcrypt');
const checkUserLogin = require('./checkUserLogin.js');


const password = "purple"; // you will probably this from req.params
var hashedPassword = bcrypt.hashSync(password, 10);
var hashedPassword2 = bcrypt.hashSync(password, 10);


if (bcrypt.compareSync(password, userDatabase[userID].password)){
  return userID;
}




