const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser"); // Allows us to handle 'POST' reqs
const cookieSession = require('cookie-session');
var generateRandomString = require('./generateRandomString.js');
const checkUserLogin = require('./checkUserLogin.js');
const findLongUrl = require('./findLongUrl.js');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'sesion',
  keys: ['nickelback'],
  maxAge: 24*60*60*1000, // 24 hours
  unset: 'destroy'
}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

var defaultUrlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var userDatabase = {};

//-----------GET HANDLERS--------------------------------------------------------------------------------------

// HOMEPAGE
app.get("/", (req, res) => {
  let userInfo = userDatabase[req.session.userID];
  if (userInfo) {
    res.redirect('/urls');
  } else{
    res.render('home_page.ejs');
  }
});

// LIST ALL URLs in user's database 
app.get('/urls', function(req, res){
  let userInfo = userDatabase[req.session.userID];
  if (userInfo){
    res.render('urls_index', userInfo);
  } else{
    res.redirect('/login');
  }
});

// NEW URL page
app.get('/urls/new', function (req, res){
  let userInfo = userDatabase[req.session.userID];
  res.render('urls_new.ejs', userInfo);
});

// REGISTRATION page:
app.get('/register', function(req, res){
  res.render('register.ejs');
});

// EDIT URL
app.get('/urls/:shortUrl', function(req, res){
  let userInfo = userDatabase[req.session.userID];
  let templateVars = {shortUrl: req.params.shortUrl, longUrl: userDatabase[req.session.userID].urlDatabase[req.params.shortUrl]};

  if (userInfo.urlDatabase[req.params.shortUrl]){
    res.render('urls_show.ejs', templateVars);
  } else {
    res.end('WRONG SHORT URL!!!!');
  }
});

// LOGIN Page
app.get('/login', function(req, res){
  let userInfo = userDatabase[req.session.userID];
  res.render('login.ejs', userInfo);
});


// REDIRECT to longURL original website
app.get('/u/:shortURL', function(req, res){
  let userInfo = userDatabase[req.session.userID];
  let longUrl = findLongUrl(req.params.shortURL, userDatabase);
  // check if shortURL is in database:
  if (longUrl){
    // Add 'https://' to the longURL if it was omitted by the user:
    if (longUrl.slice(0,4) == 'http'){
    res.redirect(longUrl);
    } else {
    res.redirect('https://' + longUrl);
    }
  } else{
    res.end('WRONG SHORTENED URL!!!');
  }
});



// ----------POST HANDLERS---------------------------------------------------------------------------------------

// Create a NEW SHORT URL
app.post('/urls/new', (req, res) => {
  let userInfo = userDatabase[req.session.userID];
  let newShortUrl = generateRandomString();
  userInfo.urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect('/urls');
});



// Handle LOGIN:
app.post('/login', function(req, res){
  // If there is alreay a cookie for the username:
  if (userDatabase[req.session.userID]){
    res.redirect('/urls');
    res.end();
  }

  // If they have entered data into the login form
  else if (checkUserLogin(req.body.email, req.body.password, userDatabase)){
    req.session.userID = checkUserLogin(req.body.email, req.body.password, userDatabase);
    res.redirect('/urls');
  } else{
    res.status(403);
    res.end('Incorrect email/password!');
  }
});

// Handle LOGOUT:
app.post('/logout', function(req,res){
  req.session = null;
  res.redirect('/');
});

// REGISTRATION:
app.post('/register', function(req, res){
  var newUserID = `user${Object.keys(userDatabase).length+1}${generateRandomString()}`;

  if (req.body.email === ''){
    res.status(400).send('Invalid username');
    res.end();
  } else if(req.body.password === ''){
    res.status(400).send('Invalid password');
    res.end();
  }

  userDatabase[newUserID] = {email: req.body.email, password: bcrypt.hashSync(req.body.password, 10),
    urlDatabase: { "b2xVn2": "http://www.lighthouselabs.ca", "9sm5xK": "http://www.google.com"}, userID: newUserID};
  req.session.userID = newUserID;
  res.redirect('/urls');
});



//-------------PUT HANDLERS----------------------------------------------------------------------------------

// Handle the UPDATE URL rquest from the Single URL page
app.put('/urls/:shortURL', function(req, res){
  let urlToUpdate = req.params.shortURL;
  let newLongUrl = req.body.longURL;
  userDatabase[req.session.userID].urlDatabase[urlToUpdate] = newLongUrl;
  res.redirect('/urls');
});



//-------------DELETE HANDLERS--------------------------------------------------------------------------------

// DELETE URL:
app.delete('/urls/:id/delete', function(req, res){
  let userInfo = userDatabase[req.session.userID];
  let shortUrlToDelete = req.params.id;
  delete userDatabase[req.session.userID].urlDatabase[shortUrlToDelete];
  res.redirect('/urls');
});



// Fire up the server!
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

