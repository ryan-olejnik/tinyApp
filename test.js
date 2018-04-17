var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


var templateVariables = {urls: urlDatabase};

function callback(x) {
  console.log(x);
}



for (let key in templateVariables.urls){
  console.log(`${key} = ${templateVariables.urls[key]}`);
}