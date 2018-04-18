const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

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

app.post('/urls', (request, response) => {
  console.log('request.body =\n', request.body);
  response.end('THANKS for the url!!');
});



// LIST OF ALL URLS
app.get('/urls', function(request, response){
  let templateVariables = {urls: urlDatabase };
  response.render('urls_index', templateVariables);
});


// SINGLE URL 
app.get('/urls/:id', function(request, response){
  let templateVariables = {'shortURL': request.params.id, 'longURL': urlDatabase[request.params.id]};
  response.render('urls_show.ejs', templateVariables);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});