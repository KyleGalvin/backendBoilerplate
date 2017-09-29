//index.ts
import * as express from "express";
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})