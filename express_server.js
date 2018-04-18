const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser"); // Allows us to handle 'POST' requests

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// HOMEPAGE
app.get("/", (request, response) => {
  // console.log('this is the sauce', request);
  response.render('home_page.ejs');
});

// NEW URL FORM PAGE:
app.get('/urls/new', function (request, response){
  response.render('urls_new.ejs');
});

// Handle the POST request from the form:
app.post('/urls', (request, response) => {
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = request.body.longURL;
  console.log(urlDatabase);
  response.redirect('/urls/' + newShortUrl);
});

// LIST OF ALL URLS
app.get('/urls', function(request, response){
  let templateVariables = {urls: urlDatabase };
  response.render('urls_index', templateVariables);
});


// SHOW SINGLE URL 
app.get('/urls/:id', function(request, response){
  let templateVariables = {'shortURL': request.params.id, 'longURL': urlDatabase[request.params.id]};
  
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




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString(){
  // Generate a random string of 6 characters:
  var randomKey = '';
  for (let i = 0; i < 6; i++){
    randomKey += Math.floor(Math.random()*10);
  }
  return randomKey;
}