const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser"); // Allows us to handle 'POST' reqs
const cookieParser = require('cookie-parser');
var generateRandomString = require('./generateRandomString.js');
const checkUser = require('./checkUser.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var userDatabase = {};

//-----------GET HANDLERS--------------------------------------------------------------------------------------

// Homepage
app.get("/", (req, res) => {
  let isLoggedIn = checkUser(req.cookies.email, req.cookies.password, userDatabase).isValid;
  let templateVariables = {email: req.cookies.email, isLoggedIn: isLoggedIn};
  res.render('home_page.ejs', templateVariables);
});

// List if all urls in database ------------->
app.get('/urls', function(req, res){
  let isLoggedIn = checkUser(req.cookies.email, req.cookies.password, userDatabase).isValid;
  let templateVariables = {urls: urlDatabase, email: req.cookies.email, isLoggedIn: isLoggedIn};
  res.render('urls_index', templateVariables);
});

// New url page
app.get('/urls/new', function (req, res){
  let isLoggedIn = checkUser(req.cookies.email, req.cookies.password, userDatabase).isValid;
  let templateVariables = {email: req.cookies.email, isLoggedIn: isLoggedIn};
  res.render('urls_new.ejs', templateVariables);
});

// Registration page:};
app.get('/register', function(req, res){
  res.render('register.ejs');
});

// Single URL page (with option to update longURL)
app.get('/urls/:id', function(req, res){
  let isLoggedIn = checkUser(req.cookies.email, req.cookies.password, userDatabase).isValid;
  let templateVariables = {'shortURL': req.params.id, 'longURL': urlDatabase[req.params.id], email: req.cookies.email, isLoggedIn: isLoggedIn};
  if (urlDatabase[templateVariables.shortURL]){
  } else {
    res.end('WRONG SHORTENED URL!!!!');
  }
});

app.get('/login', function(req, res){
  let templateVariables = {};
  res.render('login.ejs', templateVariables)
});


// Redirect to longURL original website
app.get('/u/:shortURL', function(req, res){
  let longURL = urlDatabase[req.params.shortURL];
  // check if shortURL is in database:
  if (urlDatabase[req.params.shortURL]){
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
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
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
  let shortUrlToDelete = req.params.id;
  delete urlDatabase[shortUrlToDelete];
  res.redirect('/urls');
});

// Handle Login:
app.post('/login', function(req, res){
  // DETERMINE IF THE LOGIN/PASSWORD MATCH ANYTHING IN THE DATABASE: 
  if (checkUser(req.body.email, req.body.password, userDatabase).isValid){
    res.cookie('email', req.body.email);
    res.cookie('password', req.body.password);
    res.redirect('/urls');
  } else{
    res.end(checkUser(req.body.email, req.body.password, userDatabase).errorStatus);
  }
});

// Handle Logout:
app.post('/logout', function(req,res){
  // delete cookie
  res.clearCookie('email');
  res.clearCookie('password');
  res.redirect('/');
});


// Handle POST from registration:
app.post('/register', function(req, res){
  var newUserID = `user${Object.keys(userDatabase).length+1}`;
  if (req.body.email === ''){
    res.status(400).send('Invalid username');
    res.end();
  } else if(req.body.password === ''){
    res.status(400).send('Invalid password');
    res.end();
  }



  userDatabase[newUserID] = {email: req.body.email, password: req.body.password};
  let isLoggedIn = checkUser(req.cookies.email, req.cookies.password, userDatabase).isValid;
  let templateVariables = {email: req.cookies.email, isLoggedIn: isLoggedIn};
  res.render('home_page.ejs', templateVariables);
});


// Fire up the server!
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

