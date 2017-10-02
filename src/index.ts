//index.ts
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import config from "../config/confManager";

var app = express();
app.use(bodyParser.json());
app.use(cors());

var corsOptions = {
  origin: config.modelServer
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', cors(corsOptions), function (req, res) {
  res.json({"user": {
      "firstName": "Jane B",
      "lastName": "Doe",
      "avatar": "http://localhost:8080/dist/data/avatar.jpg"
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});