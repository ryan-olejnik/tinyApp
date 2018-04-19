const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser"); // Allows us to handle 'POST' requests
const cookieParser = require('cookie-parser');
var generateRandomString = require('./generateRandomString.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var userDatabase = {};

// HOMEPAGE
app.get("/", (request, response) => {
  let templateVariables = {email: request.cookies.email};
  response.render('home_page.ejs', templateVariables);
});

// NEW URL FORM PAGE:
app.get('/urls/new', function (request, response){
  // add in temp variables:
  let templateVariables = {email: request.cookies.email};
  response.render('urls_new.ejs', templateVariables);
});

// Handle the POST request from the form:
app.post('/urls', (request, response) => {
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = request.body.longURL;
  // console.log(urlDatabase);
  response.redirect('/urls/' + newShortUrl);
});

// LIST OF ALL URLS
app.get('/urls', function(request, response){
  let templateVariables = {urls: urlDatabase, email: request.cookies.email};
  response.render('urls_index', templateVariables);
});


// SHOW SINGLE URL 
app.get('/urls/:id', function(request, response){
  let templateVariables = {'shortURL': request.params.id, 'longURL': urlDatabase[request.params.id], email: request.cookies.email};
  
  if (urlDatabase[templateVariables.shortURL]){
    // console.log(`${templateVariables.shortURL} is in the dataase!`);
    response.render('urls_show.ejs', templateVariables);
  } else {
    response.end('WRONG SHORTENED URL!!!!');
  }
});

// Redirect to the original website using the short url:
app.get('/u/:shortURL', function(request, response){
  let longURL = urlDatabase[request.params.shortURL];
  
  // check if shortURL is in database:
  if (urlDatabase[request.params.shortURL]){
    if (longURL.slice(0,4) == 'http'){
    response.redirect(longURL);
    } else {
    response.redirect('https://' + longURL);
    }
  } else{
    response.end('WRONG SHORTENED URL!!!');
  }
});

// Handle the 'DELETE URL' request:
app.post('/urls/:id/delete', function(request, response){
  // console.log(`User wants to delete: ${request.params.id}`);
  let shortUrlToDelete = request.params.id;
  delete urlDatabase[shortUrlToDelete];
  response.redirect('/urls');
});

// Handle the 'UPDATE URL' rquest:
app.post('/urls/:shortURL', function(request, response){
  let urlToUpdate = request.params.shortURL;
  let newLongUrl = request.body.longURL;
  urlDatabase[urlToUpdate] = newLongUrl;
  response.redirect('/urls');
});

// Handle Login:
app.post('/login', function(request, response){
  response.cookie('email', request.body.email);
  // DETERMINE IF THE LOGIN/PASSWORD MATCH ANYTHING IN THE DATABASE: 
  var input_email = request.body.email;
  var input_password = request.body.password;

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
    response.redirect('/urls');
  } else if (isUserMatch === true && isPassMatch === false){
    response.end('Incorrect Password!!');
  } else {
    response.end('Incorrect email!!!');
  }
});

// Handle Logout:
app.post('/logout', function(request,response){
  // delete cookie
  response.clearCookie('email');
  response.redirect('/');
});

// Registration page:
app.get('/register', function(request, response){
  response.render('register.ejs');
});

// Handle response from registration:
app.post('/register', function(request, response){
  var newUserID = `user${Object.keys(userDatabase).length+1}`;
  userDatabase[newUserID] = {email: request.body.email, password: request.body.password};
  console.log(userDatabase);
  let templateVariables = {email: request.cookies.email};
  response.render('home_page.ejs', templateVariables);
});



app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});


