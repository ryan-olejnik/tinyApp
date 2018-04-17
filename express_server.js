const app = require('express')();
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (request, response) => {
  response.write("Hello! This is the homepage!");
  response.end();
});

app.get('/urls', function(request, response){
  let templateVariables = {urls: urlDatabase };
  response.render('urls_index', templateVariables);
});

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);

// });

// app.get("/hello", (req, res) => {
//   res.end('<html><body>Hello <b>World</b></body></html>\n');
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});