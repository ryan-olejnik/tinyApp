const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser"); // Allows us to handle 'POST' reqs
const cookieParser = require('cookie-parser');
var generateRandomString = require('./generateRandomString.js');
const checkUserLogin = require('./checkUserLogin.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

var defaultUrlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var userDatabase = {};
// userDatabase format: user13434: {email: ryan@gmail.com, password: pass123, urlDatabase: {}}

//-----------GET HANDLERS--------------------------------------------------------------------------------------

// Homepage
app.get("/", (req, res) => {
  res.render('home_page.ejs');
});

// List all urls in user's database 
app.get('/urls', function(req, res){
  let userInfo = userDatabase[req.cookies.userID];
  res.render('urls_index', userInfo);
});

// New url page
app.get('/urls/new', function (req, res){
  let userInfo = userDatabase[req.cookies.userID];
  res.render('urls_new.ejs', userInfo);
});

// Registration page:
app.get('/register', function(req, res){
  res.render('register.ejs');
});

// Single URL page (with option to update longURL)
app.get('/urls/:shortURL', function(req, res){
  let userInfo = userDatabase[req.cookies.userID];

  if (userInfo.urlDatabase[req.params.shortURL]){
  } else {
    res.end('WRONG SHORTENED URL!!!!');
  }
});

app.get('/login', function(req, res){
  let userInfo = userDatabase[req.cookies.userID];
  res.render('login.ejs', userInfo);
});


// Redirect to longURL original website
app.get('/u/:shortURL', function(req, res){
  let userInfo = userDatabase[req.cookies.userID];
  let longURL = userInfo.urlDatabase[req.params.shortURL];
  // check if shortURL is in database:
  if (userInfo.urlDatabase[req.params.shortURL]){
    // Add 'https://' to the longURL if it was omitted by the user:
    if (longURL.slice(0,4) == 'http'){
    res.redirect(longURL);
    } else {
    res.redirect('https://' + longURL);
    }
  } else{
    res.end('WRONG SHORTENED URL!!!');
  }
});



// ----------POST HANDLERS---------------------------------------------------------------------------------------

// POST from new url page:
app.post('/urls/new', (req, res) => {
  let userInfo = userDatabase[req.cookies.userID];
  let newShortUrl = generateRandomString();
  userInfo.urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect('/urls');
});

// Handle the 'UPDATE URL' rquest from the Single URL page
app.post('/urls/:shortURL', function(req, res){
  let urlToUpdate = req.params.shortURL;
  let newLongUrl = req.body.longURL;
  urlDatabase[urlToUpdate] = newLongUrl;
  res.redirect('/urls');
});

// Handle the 'DELETE URL' req:
app.post('/urls/:id/delete', function(req, res){
  let userInfo = userDatabase[req.cookies.userID];
  let shortUrlToDelete = req.params.id;
  delete userDatabase[req.cookies.userID].urlDatabase[shortUrlToDelete];
  res.redirect('/urls');
});

// Handle Login:
app.post('/login', function(req, res){
  // DETERMINE IF THE LOGIN/PASSWORD MATCH ANYTHING IN THE DATABASE: 
  if (checkUserLogin(req.body.email, req.body.password, userDatabase)){
    res.cookie('userID', checkUserLogin(req.body.email, req.body.password, userDatabase));
    console.log('the following user just logged in:', userDatabase[checkUserLogin(req.body.email, req.body.password, userDatabase)]);
    res.redirect('/urls');
  } else{
    res.status(403);
    res.end('Incorrect email/password!');
  }
});

// Handle Logout:
app.post('/logout', function(req,res){
  // delete cookie
  res.clearCookie('userID');
  res.redirect('/');
});

// Handle POST from registration:
app.post('/register', function(req, res){
  var newUserID = `user${Object.keys(userDatabase).length+1}${generateRandomString()}`;

  if (req.body.email === ''){
    res.status(400).send('Invalid username');
    res.end();
  } else if(req.body.password === ''){
    res.status(400).send('Invalid password');
    res.end();
  }

  userDatabase[newUserID] = {email: req.body.email, password: req.body.password,
  urlDatabase: { "b2xVn2": "http://www.lighthouselabs.ca", "9sm5xK": "http://www.google.com"}, userID: newUserID};
  let isLoggedIn = checkUserLogin(req.cookies.email, req.cookies.password, userDatabase).isValid;
  let templateVariables = {email: req.cookies.email, isLoggedIn: isLoggedIn};
  console.log('new user added to userDatabase:', userDatabase);
  res.render('home_page.ejs', templateVariables);
});


// Fire up the server!
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

