module.exports = function generateRandomString(){
  // Generate a random string of 6 characters:
  var randomKey = '';
  for (let i = 0; i < 6; i++){
    randomKey += Math.floor(Math.random()*10);
  }
  return randomKey;
};