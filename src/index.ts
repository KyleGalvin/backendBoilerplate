import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Knex from "knex";
import * as Bookshelf from "bookshelf";

import auth from "./controllers/auth";
import diagnostics from "./controllers/diagnostics";
import config from "./config/local";

const knex = Knex({
  "client": "postgres",
  "connection": config.connectionString
});

const bookshelf = Bookshelf(knex);

const User = bookshelf.Model.extend({
  "tableName": "users"
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(auth);
app.use(diagnostics);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
