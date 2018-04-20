const bcrypt = require('bcrypt');
const password = "purple"; // you will probably this from req.params
var hashedPassword = bcrypt.hashSync(password, 1);
var hashedPassword2 = bcrypt.hashSync(password, 1);



console.log(bcrypt.compareSync('purple', hashedPassword));
console.log(bcrypt.compareSync('purple', hashedPassword2));

