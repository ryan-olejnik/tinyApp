// check the urlDatabase of all users:
module.exports = function findLongUrl(input_shortUrl, userDatabase){
  for (let user in userDatabase){
    for (let shortUrl in userDatabase[user].urlDatabase){
      if (shortUrl === input_shortUrl){
        return userDatabase[user].urlDatabase[shortUrl];
      }
    }
  }
};




