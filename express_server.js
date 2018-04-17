const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (request, response) => {
  // console.log('this is the sauce', request);
  response.render('home_page.ejs');
});

app.get('/urls', function(request, response){
  let templateVariables = {urls: urlDatabase };
  response.render('urls_index', templateVariables);
});

app.get('/urls/:id', function(request, response){
  let templateVariables = {'shortURL': request.params.id, 'longURL': urlDatabase[request.params.id]};
  response.render('urls_show.ejs', templateVariables);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});